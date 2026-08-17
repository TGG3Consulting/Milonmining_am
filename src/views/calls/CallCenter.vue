<template>
  <div class="p-4 space-y-6">
    <!-- Վերնագիր / Գործիքներ -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold">Զանգերի կենտրոն</h1>
      </div>

      <div class="flex items-center gap-2">
        <button @click="reload" :disabled="loading"
                class="px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
          Թարմացնել
        </button>
        <label class="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="auto" class="rounded">
          <span class="text-sm text-gray-600">Ավտո թարմացում (15վ)</span>
        </label>
      </div>
    </div>

    <!-- Վիճակագրական քարտեր -->
    <div class="grid sm:grid-cols-3 gap-4">
      <div class="card">
        <p class="text-xs text-gray-500">Ընդամենը ցուցակում</p>
        <p class="text-2xl font-semibold">{{ calls.length }}</p>
      </div>
      <div class="card">
        <p class="text-xs text-gray-500">Բաց թողնված</p>
        <p class="text-2xl font-semibold text-rose-600">{{ missedCount }}</p>
      </div>
      <div class="card">
        <p class="text-xs text-gray-500">Օպերատորներ</p>
        <p class="text-2xl font-semibold">{{ accounts.length }}</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Ձախ — Ֆիլտրեր + Աղյուսակ -->
      <div class="lg:col-span-2 space-y-3">
        <!-- Ֆիլտրեր (այսօրվա միջակայք default) -->
        <div class="rounded-2xl border border-gray-300 bg-white p-4 shadow-sm">
          <p class="font-medium mb-3">Ֆիլտրեր</p>
          <div class="grid md:grid-cols-4 gap-3">
            <div>
              <label class="label">Սկիզբ</label>
              <input type="datetime-local" v-model="fromLocal" class="input">
            </div>
            <div>
              <label class="label">Ավարտ</label>
              <input type="datetime-local" v-model="toLocal" class="input">
            </div>
            <div>
              <label class="label">Տիպ</label>
              <select v-model="type" class="input">
                <option value="">Բոլորը</option>
                <option value="in">Մուտքային</option>
                <option value="out">Ելքային</option>
              </select>
            </div>
            <div>
              <label class="label">Կարգավիճակ</label>
              <select v-model="status" class="input">
                <option value="">Բոլորը</option>
                <option value="answered">Պատասխանված</option>
                <option value="missed">Բաց թողնված</option>
                <option value="noanswer">Չպատասխանված</option>
              </select>
            </div>
          </div>

          <div class="grid md:grid-cols-3 gap-3 mt-3">
            <div class="md:col-span-2">
              <label class="label">Փնտրել (հեռախոս)</label>
              <input v-model.trim="q" placeholder="+374…" class="input">
            </div>
<!--            <div>-->
<!--              <label class="label">Մեկ էջում</label>-->
<!--              <select v-model.number="per" class="input">-->
<!--                <option :value="25">25</option>-->
<!--                <option :value="50">50</option>-->
<!--                <option :value="100">100</option>-->
<!--              </select>-->
<!--            </div>-->
          </div>

          <div class="flex items-center gap-2 mt-4">
            <button @click="reload" :disabled="loading"
                    class="px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
              Կիրառել
            </button>
            <button @click="resetFilters" class="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50">
              Մաքրել
            </button>
          </div>
        </div>

        <!-- Աղյուսակի վերևի տուլբար — Իմ Ext dropdown (նոր) -->
        <div class="flex items-center justify-end gap-2">
          <select v-model="extSelected" class="input" @change="persistExt">
            <option value="" disabled>Ընտրել</option>
            <option v-for="a in accounts" :key="a.extension" :value="a.extension">
              {{ a.name || a.login }} — {{ a.extension }}
            </option>
          </select>
        </div>

        <!-- Աղյուսակ (գեղեցիկ ձևավորում) -->
        <div class="bg-white shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr class="text-left">
                <th class="px-6 py-3"></th>
                <th class="px-6 py-3">Ձայնագրություն</th>
                <th class="px-6 py-3">Ժամանակ</th>
                <th class="px-6 py-3">Տիպ</th>
                <th class="px-6 py-3">Կարգավիճակ</th>
                <th class="px-6 py-3">Հաճախորդ</th>
                <th class="px-6 py-3">Ուղղություն</th>
                <th class="px-6 py-3">Խումբ</th>
                <th class="px-6 py-3">Սպասում (վ)</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="c in paged" :key="c.uid"
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <td class="px-6 py-4">
                  <button
                      class="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      @click="callRow(c)" :disabled="calling">
                    Զանգել
                  </button>
                </td>
                <td class="px-6 py-4">
                  <div v-if="c.record" class="flex items-center gap-2">
                    <button
                        class="px-3 py-1 text-xs font-medium text-white bg-sky-600 rounded-md shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        @click="openRecording(c.record)">Լսել</button>
                    <!-- <a :href="c.record" target="_blank" class="text-blue-600 hover:underline">Ներբեռնել</a> -->
                  </div>
                  <span v-else class="text-gray-400">—</span>
                </td>
                <td class="px-6 py-4">{{ fmtDate(c.start) }}</td>
                <td class="px-6 py-4">
                  <span :class="typeBadge(c.type)">{{ mapType(c.type) }}</span>
                </td>
                <td class="px-6 py-4">
                  <span :class="statusBadge(c.status)">{{ mapStatus(c.status) }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span class="font-mono">{{ fmtPhone(c.client) }}</span>
                    <button class="btn-ghost" @click="copy(c.client)" title="Պատճենել">⧉</button>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span v-if="c.destination==='group'" class="text-gray-500">Խմբին</span>
                  <span v-else class="font-mono">{{ c.destination || '—' }}</span>
                </td>
                <td class="px-6 py-4">{{ c.group_name || '—' }}</td>
                <td class="px-6 py-4">{{ c.wait ?? '—' }}</td>
              </tr>
              <tr v-if="!loading && paged.length===0">
                <td colspan="8" class="td text-center text-gray-500">Արդյունք չի գտնվել</td>
              </tr>
              </tbody>
            </table>
          </div>

          <!-- Client-side էջավորում -->
          <div class="flex items-center justify-between bg-gray-50 p-3 text-sm text-gray-600">
            <span>
              Էջ {{ page }} • Ցուցադրված {{ paged.length }} / {{ filtered.length }} (ընդհանուր {{ calls.length }})
            </span>
            <div class="flex items-center gap-2">
              <button class="px-3 py-1.5 rounded-xl border bg-white hover:bg-gray-50"
                      @click="prevPage" :disabled="page<=1">Նախ.</button>
              <button class="px-3 py-1.5 rounded-xl border bg-white hover:bg-gray-50"
                      @click="nextPage" :disabled="page>=totalPages">Հաջ.</button>
              <button class="px-3 py-1.5 rounded-xl border bg-white hover:bg-gray-50"
                      @click="scrollTop">Վերև ↑</button>
            </div>
          </div>
        </div>

        <div v-if="loading" class="text-sm text-gray-500">Բեռնում…</div>
        <div v-if="error" class="text-sm text-rose-700">Սխալ․ {{ error }}</div>
      </div>

      <!-- Աջ — Օպերատորներ + Make Call -->
      <div class="space-y-3">
        <!-- Օպերատորներ -->
        <div class="rounded-2xl border border-gray-300 bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <p class="font-medium">Օպերատորների ցանկ</p>
            <span class="text-xs text-gray-500">{{ accounts.length }} հատ</span>
          </div>

          <div class="space-y-2">
            <div v-for="a in accounts" :key="a.login"
                 class="flex items-center justify-between gap-3 rounded-xl border p-3 hover:bg-gray-50">
              <div class="min-w-0">
                <p class="truncate font-medium">{{ a.name || a.login }}</p>
                <p class="text-xs text-gray-500">{{ a.position || '—' }}</p>
              </div>
              <div class="text-right">
                <div class="inline-flex items-center gap-2">
                  <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium">Ext {{ a.extension || '—' }}</span>
                  <span :class="roleChip(a.role)">{{ mapRole(a.role) }}</span>
                </div>
                <p v-if="a.email" class="text-xs text-gray-500 mt-1 truncate">{{ a.email }}</p>
              </div>
            </div>
          </div>

          <div class="pt-3">
            <button @click="reloadAccounts" :disabled="loadingAccounts"
                    class="w-full px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 disabled:opacity-50">
              Վերաբեռնել օպերատորներին
            </button>
          </div>
        </div>

        <!-- Make Call -->
        <div class="rounded-2xl border border-gray-300 bg-white p-4 shadow-sm">
          <p class="font-medium mb-3">Զանգ կատարել</p>
          <div class="space-y-3">
            <div class="flex flex-col gap-y-2">
              <select v-model="dial.from_ext" class="input">
                <option value="" disabled>Ընտրեք օպերատոր</option>
                <option v-for="a in accounts" :key="a.extension" :value="a.extension">
                  {{ a.name || a.login }} — {{ a.extension }}
                </option>
              </select>
            </div>
            <div class="flex flex-col gap-y-2">
              <label class="label">Հաճախորդի համար</label>
              <input v-model.trim="dial.to" placeholder="+374..." class="input">
            </div>
            <div class="flex flex-col gap-y-2">
              <label class="label">Ցուցադրվող անուն (ըստ ցանկության)</label>
              <input v-model.trim="dial.name" placeholder="Անուն Ազգանուն" class="input">
            </div>
            <button @click="makeCall" :disabled="calling || !canDial"
                    class="w-full px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
              {{ calling ? 'Զանգահարում…' : 'Զանգել' }}
            </button>
            <p v-if="callMsg" class="text-sm" :class="{'text-emerald-700': callOk, 'text-rose-700': !callOk}">
              {{ callMsg }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recording modal -->
    <div v-if="recording" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium">Ձայնագրություն</h3>
          <button class="btn-ghost text-2xl" @click="recording=null">×</button>
        </div>
        <audio v-if="recording" :src="recording" controls class="w-full"></audio>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import api from "@/utils/api.js"

/* ---------- Helpers: local datetime-local <-> ISO Z ---------- */
function toLocalInput(d) {
  const pad = n => (n < 10 ? '0'+n : n)
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
function todayRangeLocal() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  return { fromLocal: toLocalInput(start), toLocal: toLocalInput(now) }
}
function localToIsoZ(v) {
  if (!v) return null
  const d = new Date(v)
  return isNaN(d) ? null : d.toISOString()
}

/* ---------- State ---------- */
const calls = ref([])
const accounts = ref([])
const loading = ref(false)
const error = ref('')
const loadingAccounts = ref(false)

/* Filters (no page field) */
const { fromLocal: initFrom, toLocal: initTo } = todayRangeLocal()
const fromLocal = ref(initFrom)
const toLocal   = ref(initTo)
const q = ref('')
const type = ref('')       // '', 'in', 'out'
const status = ref('')     // '', 'answered', 'missed', ...
const per = ref(50)        // client-side per-page
const page = ref(1)        // internal page for client-side nav

/* Auto refresh */
const auto = ref(false)
let timer = null

/* My Ext (table toolbar) */
const extSelected = ref(localStorage.getItem('pbx_ext') || '')
function persistExt(){ localStorage.setItem('pbx_ext', extSelected.value || '') }

/* Derived: filtering + pagination (client-side) */
const missedCount = computed(() => calls.value.filter(c => c.status === 'missed').length)
const filtered = computed(() => {
  const query = q.value.replace(/\D+/g, '')
  return calls.value.filter(c => {
    const passQ = !query || (String(c.client || '').replace(/\D+/g, '').includes(query))
    const passType = !type.value || c.type === type.value
    const passStatus = !status.value || c.status === status.value
    return passQ && passType && passStatus
  })
})
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / per.value)))
const paged = computed(() => {
  const p = Math.min(page.value, totalPages.value)
  const start = (p - 1) * per.value
  return filtered.value.slice(start, start + per.value)
})

/* ---------- Fetchers ---------- */
async function fetchCalls() {
  loading.value = true
  error.value = ''
  try {
    const params = {
      from: localToIsoZ(fromLocal.value),
      to:   localToIsoZ(toLocal.value)
    }
    const { data } = await api.get(`/pbx/calls`, { params, withCredentials: true })
    calls.value = Array.isArray(data) ? data : (data.items ?? [])
    page.value = 1 // reset page after fetch
  } catch (e) {
    error.value = e?.response?.data?.message ?? e.message ?? 'Չհաջողվեց բեռնել'
  } finally {
    loading.value = false
  }
}
async function fetchAccounts() {
  loadingAccounts.value = true
  try {
    const { data } = await api.get(`/pbx/accounts`, { withCredentials: true })
    accounts.value = data.accounts ?? []
    // auto-pick if only one ext exists
    if (!extSelected.value && accounts.value.length === 1) {
      extSelected.value = accounts.value[0]?.extension || ''
      persistExt()
    }
  } finally {
    loadingAccounts.value = false
  }
}

/* Controls */
function reload() { fetchCalls() }
function resetFilters() {
  const r = todayRangeLocal()
  fromLocal.value = r.fromLocal
  toLocal.value   = r.toLocal
  q.value = ''; type.value = ''; status.value = ''
  per.value = 50; page.value = 1
  fetchCalls()
}
function nextPage() { if (page.value < totalPages.value) page.value++ }
function prevPage() { page.value = Math.max(1, page.value - 1) }
function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

/* Utils */
function copy(text) { navigator.clipboard?.writeText(String(text ?? '')) }
function fmtPhone(p) { return p ? '+' + String(p).replace(/^(\+?)/,'') : '—' }
function fmtDate(iso) {
  const d = new Date(iso); if (isNaN(d)) return iso || '—'
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
function mapType(t) { return t==='in'?'Մուտքային': t==='out'?'Ելքային': t || '—' }
function mapStatus(s) {
  const dict = { answered: 'Պատասխանված', missed: 'Բաց թողնված', noanswer: 'Չպատասխանված', success: 'Պատասխանված' }
  return dict[s] ?? s ?? '—'
}
function mapRole(r) { return ({admin:'Ադմին', user:'Օգտվող'}[r] ?? r ?? '—') }
function typeBadge(t) {
  return ['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
    t==='in' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700']
}
function statusBadge(s) {
  if (s==='missed')    return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700'
  if (s==='answered')  return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700'
  if (s==='success')   return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700'
  return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700'
}
function roleChip(role) {
  return ['rounded-full px-2 py-0.5 text-xs font-medium',
    role==='admin' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-700']
}

/* Make Call */
const dial = ref({ from_ext: '', to: '', name: '' })
const calling = ref(false)
const callMsg = ref(''); const callOk = ref(false)
const canDial = computed(() => !!dial.value.from_ext && !!dial.value.to)

async function makeCall() {
  if (!canDial.value) return
  calling.value = true; callMsg.value = ''; callOk.value = false
  try {
    const payload = { from_ext: dial.value.from_ext, to: dial.value.to, name: dial.value.name || undefined }
    const { data } = await api.post(`/pbx/make-call`, payload, { withCredentials: true })
    callOk.value = true
    callMsg.value = data?.message ?? 'Զանգը մեկնարկել է'
  } catch (e) {
    callOk.value = false
    callMsg.value = e?.response?.data?.message ?? e.message ?? 'Չստացվեց սկսել զանգը'
  } finally {
    calling.value = false
  }
}

/* Make Call (per-row): now prefers table dropdown extSelected */
async function callRow(c) {
  const number = c?.client || ''
  const selectedExt = extSelected.value || dial.value.from_ext || ''

  if (!selectedExt) {
    callOk.value = false
    callMsg.value = 'Խնդրում ենք ընտրել ձեր Ext-ը (աղյուսակի վերևի «Իմ Ext» ընտրիչից կամ աջ կողմի ձևից)'
    scrollTop()
    return
  }
  if (!number) {
    callOk.value = false
    callMsg.value = 'Հաճախորդի համար չկա այս տողում'
    return
  }

  calling.value = true; callMsg.value = ''; callOk.value = false
  try {
    const payload = { from_ext: selectedExt, to: '+' + String(number).replace(/^(\+?)/,''), name: undefined }
    const { data } = await api.post(`/pbx/make-call`, payload, { withCredentials: true })
    callOk.value = true
    callMsg.value = data?.message ?? 'Զանգը մեկնարկել է'
  } catch (e) {
    callOk.value = false
    callMsg.value = e?.response?.data?.message ?? e.message ?? 'Չստացվեց սկսել զանգը'
  } finally {
    calling.value = false
  }
}

/* Recording modal */
const recording = ref(null)
function openRecording(url) { recording.value = url }

/* Auto refresh */
watch(auto, (v) => {
  if (v) timer = setInterval(fetchCalls, 15000)
  else if (timer) { clearInterval(timer); timer = null }
})
onMounted(async () => {
  await Promise.all([fetchAccounts(), fetchCalls()])
  if (auto.value) timer = setInterval(fetchCalls, 15000)
})
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.card { @apply rounded-2xl border bg-white p-4 shadow-sm; }
.input { @apply w-full px-3 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500; }
.label { @apply block text-sm text-gray-600 mb-1; }
.th { @apply px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide; }
.td { @apply px-3 py-2; }
.btn-ghost { @apply px-2 py-1 rounded hover:bg-gray-100; }
</style>
