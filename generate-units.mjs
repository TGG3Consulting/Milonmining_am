import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dir = path.dirname(fileURLToPath(import.meta.url));

// Laravel backend base URL — override with API_BASE env var
const API_BASE = (process.env.API_BASE || 'http://localhost:8001').replace(/\/+$/, '');

// Explicit ID→slug map loaded from BUILDING_SLUGS env var.
// Format: BUILDING_SLUGS="1:tower,2:hills,3:plaza"
// Takes priority over name-based matching.
const ID_SLUG_MAP = {};
if (process.env.BUILDING_SLUGS) {
  for (const pair of process.env.BUILDING_SLUGS.split(',')) {
    const [id, slug] = pair.trim().split(':');
    if (id && slug) ID_SLUG_MAP[Number(id)] = slug.trim();
  }
}

// Fallback: match by name substring (case-insensitive).
// Works for English and Russian names without encoding issues.
function slugFromName(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('tower') || n.includes('тауэ') || n.includes('тауе') || n.includes('tauer')) return 'tower';
  if (n.includes('hills') || n.includes('хилл') || n.includes('hill'))  return 'hills';
  if (n.includes('plaza') || n.includes('плаза'))                        return 'plaza';
  if (n.includes('townhouse') || n.includes('town house') || n.includes('таунхаус')) return 'townhouse';
  return null;
}

function resolveSlug(building) {
  return ID_SLUG_MAP[building.id] ?? slugFromName(building.name);
}

// Backend ApartmentStatusEnum value → site status string
const STATUS_MAP = {
  active:   'available',
  reserved: 'reserved',
  sold:     'sold',
};

async function apiGet(endpoint, params = {}) {
  const url = new URL(API_BASE + endpoint);
  for (const [k, v] of Object.entries(params)) {
    if (v != null) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`GET ${endpoint} → HTTP ${res.status}`);
  const json = await res.json();
  if (json.ok === false) throw new Error(`API error at ${endpoint}: ${JSON.stringify(json)}`);
  return json.data;
}

// Fetch all pages for a given filter set.
// Backend returns { current_page, data: [...], last_page, ... } inside json.data.
async function fetchAllApartments(params) {
  const all = [];
  let page = 1;
  while (true) {
    const pg = await apiGet('/apartments', { ...params, page });
    const items = Array.isArray(pg?.data) ? pg.data : [];
    all.push(...items);
    process.stdout.write(`  fetched ${all.length}...\r`);
    if (!pg?.last_page || Number(pg.current_page) >= Number(pg.last_page)) break;
    page++;
  }
  return all;
}

console.log(`Fetching buildings from ${API_BASE}/buildings ...`);
// Request Russian locale so names contain ASCII-compatible Cyrillic (e.g. "Тауэр")
// DB names may be garbled in other locales due to encoding issues.
const buildings = await apiGet('/buildings', { lang: 'ru' });
if (!Array.isArray(buildings) || buildings.length === 0) {
  throw new Error('No buildings returned from API');
}
console.log(`Found ${buildings.length} buildings`);

const units = [];

for (const building of buildings) {
  const slug = resolveSlug(building);
  if (!slug) {
    // Never skip quietly. A building that falls through the name match used to
    // be dropped from the output, and the write went ahead regardless: one
    // rename in the CRM ("Тауэр" -> "Тауер") was enough to erase every Tower
    // apartment from the site. Stop instead, and say which id needs mapping.
    throw new Error(`building id=${building.id} "${building.name}" matched no project slug. `
      + `Add it to the name matcher, or run with BUILDING_SLUGS="${building.id}:tower".`);
  }
  const totalFloors = building.floors_qty ?? null;
  console.log(`  "${building.name}" (id=${building.id}) → project=${slug}, floors=${totalFloors}`);

  // available=1 → only active; available=0 → sold + reserved
  const active   = await fetchAllApartments({ building_id: building.id, available: 1 });
  const inactive = await fetchAllApartments({ building_id: building.id, available: 0 });
  const all = [...active, ...inactive];
  process.stdout.write('\n');
  console.log(`    active=${active.length} + sold/reserved=${inactive.length} = ${all.length} total`);

  for (const apt of all) {
    const price      = typeof apt.price         === 'number' ? apt.price         : null;
    const discPrice  = typeof apt.discount_price === 'number' ? apt.discount_price : null;
    const hasDiscount = apt.discount && apt.discount > 0;

    // apt.status is the enum value string: "active" | "reserved" | "sold"
    const rawStatus = typeof apt.status === 'string' ? apt.status : (apt.status?.value ?? 'active');

    // `id` stays the row id — floorplans.js keys its polygons by it.
    // `number` is only the label the site prints, and it must be the CRM number
    // ("6+7", "166ա" and the like are legitimate values there).
    const aptNumber = apt.number == null || String(apt.number).trim() === ''
      ? String(apt.id)
      : String(apt.number).trim();

    units.push({
      id:          String(apt.id),
      number:      aptNumber,
      project:     slug,
      type:        'apartment',
      rooms:       apt.rooms       ?? null,
      area:        apt.square_meter ?? null,
      // Only carried when the CRM says there is one; the price already includes it.
      terrace:     apt.has_terrace && apt.terrace_area ? Number(apt.terrace_area) : null,
      floor:       apt.floor_level  ?? null,
      entrance:    null,
      totalFloors,
      price:       hasDiscount && discPrice != null ? discPrice : price,
      oldPrice:    hasDiscount && price != null ? price : null,
      discount:    apt.discount ?? 0,
      status:      STATUS_MAP[rawStatus] ?? 'available',
      planImage:   apt.parent_image ?? null,
      floorImage:  apt.image        ?? null,
    });
  }
}

console.log(`\nTotal units: ${units.length}`);
const byProject = units.reduce((a, u) => { a[u.project] = (a[u.project] || 0) + 1; return a; }, {});
const byStatus  = units.reduce((a, u) => { a[u.status]  = (a[u.status]  || 0) + 1; return a; }, {});
console.log('By project:', byProject);
console.log('By status:', byStatus);

// The API used to drop apartments.number from its select list, which left every
// unit labelled with its row id. Say so loudly if that ever comes back.
const fellBack = units.filter(u => u.number === u.id).length;
if (fellBack) {
  console.warn(`\n!! ${fellBack} of ${units.length} units have no number from the API `
    + `and are labelled with their row id instead.`);
  if (fellBack > units.length / 2) {
    throw new Error('The API is not returning apartments.number — refusing to publish row ids as apartment numbers.');
  }
}

// Patch site-data.js — index-based splice to avoid CRLF issues
const siteDataPath = path.join(__dir, 'site-data.js');
let siteData = readFileSync(siteDataPath, 'utf-8').replace(/\r\n/g, '\n');

const OPEN  = '    units: [';
const CLOSE = '\n    ]';

const openIdx  = siteData.indexOf(OPEN);
if (openIdx === -1) throw new Error('units block open marker not found in site-data.js');
const closeIdx = siteData.indexOf(CLOSE, openIdx + OPEN.length);
if (closeIdx === -1) throw new Error('units block close marker not found in site-data.js');

const unitsLines = units.map(u => '      ' + JSON.stringify(u)).join(',\n');
const newBlock   = `${OPEN}\n${unitsLines}${CLOSE}`;
const patched    = siteData.slice(0, openIdx) + newBlock + siteData.slice(closeIdx + CLOSE.length);

writeFileSync(siteDataPath, patched, 'utf-8');
console.log('site-data.js patched ✓');
