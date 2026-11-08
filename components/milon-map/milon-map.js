/**
 * Milon Tower neighbourhood map.
 *
 * Renders an OpenStreetMap view of the project plus the facts the CRM actually
 * publishes (address, unit counts, areas, parking). No API key is required and
 * nothing here is invented: every value comes from /buildings on the Laravel API,
 * with site-data.js as the fallback when the API is unreachable.
 *
 * Contract expected by site.js:
 *   window.MilonMap.create(container, { lang })  -> sets container.__milonMap
 *   container.__milonMap.setLanguage(lang)
 *   container.__milonMap.destroy()
 */
(() => {
  "use strict";

  const API_BASE = "https://api.milonmining.am";
  const BUILDING_ID = 3;          // Milon Tower in milon_api_v1
  const SPAN = 0.0075;            // bbox half-width in degrees (~800 m)

  const COPY = {
    hy: {
      units: "Բնակարաններ", available: "Ազատ", area: "Մակերես", parking: "Ավտոկայան",
      open: "Բացել քարտեզում", note: "Քարտեզը և տվյալները վերցված են Milon-ի CRM-ից։",
      offline: "Տվյալները ժամանակավորապես անհասանելի են։"
    },
    ru: {
      units: "Квартиры", available: "Свободно", area: "Площадь", parking: "Парковка",
      open: "Открыть на карте", note: "Карта и данные получены из CRM Milon.",
      offline: "Данные временно недоступны."
    }
  };

  let cache = null;               // shared across instances

  async function loadBuilding(lang) {
    const locale = lang === "ru" ? "ru" : "am";
    if (cache && cache.locale === locale) return cache.data;
    const res = await fetch(`${API_BASE}/buildings?lang=${locale}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const list = Array.isArray(json?.data) ? json.data : [];
    const data = list.find(b => Number(b.id) === BUILDING_ID) || list[0] || null;
    cache = { locale, data };
    return data;
  }

  function fallback(lang) {
    const D = window.MILON_DATA || {};
    const project = D.projects?.tower;
    const address = D.contacts?.address?.[lang === "ru" ? "ru" : "hy"];
    if (!project) return null;
    return { name: project.name, address, units: null, available: null, areaMin: null, areaMax: null, parking: null, coords: null };
  }

  function bbox(lat, lng) {
    return [lng - SPAN, lat - SPAN / 2, lng + SPAN, lat + SPAN / 2].join("%2C");
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function fact(label, value) {
    return value === null || value === undefined || value === ""
      ? ""
      : `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`;
  }

  function render(container, building, lang) {
    const c = COPY[lang === "ru" ? "ru" : "hy"];
    const coords = building?.coords;
    const hasCoords = coords && Number.isFinite(Number(coords.lat)) && Number.isFinite(Number(coords.lng));

    const stage = hasCoords
      ? `<iframe class="milon-map-canvas" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
           title="${esc(building.name || "Milon Tower")}"
           src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox(Number(coords.lat), Number(coords.lng))}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}"></iframe>`
      : `<div class="milon-map-canvas" style="display:grid;place-items:center;background:#e8e4da;color:#8c8575">${esc(c.offline)}</div>`;

    const area = building?.areaMin && building?.areaMax
      ? `${building.areaMin}–${building.areaMax} ${lang === "ru" ? "м²" : "մ²"}`
      : null;

    const openHref = hasCoords
      ? `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=16/${coords.lat}/${coords.lng}`
      : `https://www.openstreetmap.org/search?query=${encodeURIComponent(building?.address || "Abovyan, Armenia")}`;

    container.innerHTML =
      `<div class="milon-map-root" data-panel-mode="preview">
         <div class="milon-map-stage">${stage}</div>
         <aside class="milon-map-panel">
           <h3>${esc(building?.name || "Milon Tower")}</h3>
           ${building?.address ? `<p class="milon-map-panel__address">${esc(building.address)}</p>` : ""}
           <dl class="milon-map-facts">
             ${fact(c.units, building?.units)}
             ${fact(c.available, building?.available)}
             ${fact(c.area, area)}
             ${fact(c.parking, building?.parking)}
           </dl>
           <p class="milon-map-note">${esc(c.note)}</p>
           <a class="milon-map-panel__link" href="${openHref}" target="_blank" rel="noopener">${esc(c.open)}</a>
         </aside>
       </div>`;
  }

  function create(container, options = {}) {
    if (!container || container.__milonMap) return container?.__milonMap;

    let lang = options.lang === "ru" ? "ru" : "hy";
    let alive = true;

    const draw = async () => {
      let building = null;
      try {
        building = await loadBuilding(lang);
      } catch {
        building = fallback(lang);
      }
      if (!alive) return;
      render(container, building || fallback(lang), lang);
    };

    const instance = {
      setLanguage(next) {
        const normalised = next === "ru" ? "ru" : "hy";
        if (normalised === lang) return;
        lang = normalised;
        draw();
      },
      destroy() {
        alive = false;
        container.innerHTML = "";
        delete container.__milonMap;
      }
    };

    container.__milonMap = instance;
    draw();
    return instance;
  }

  window.MilonMap = { create };
})();
