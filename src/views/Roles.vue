<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  listRoles, createRole, updateRole, deleteRole,
  syncPermissionsFromRoutes,
  roleAssigned, searchPermissions,
  attachPermissions, detachPermissions,
  type RoleRow, type PermissionRow
} from '@/utils/rolesApi'

// --- roles state ---
const roles = ref<RoleRow[]>([])
const rolesTotal = ref<number>(0)
const loading = ref(false)

const search = ref('')
let searchTimer: any = null

// --- selection / form ---
const sel = ref<RoleRow | null>(null)
const showForm = ref(false)
const formName = ref('')
const isEditing = ref(false)

// --- assignment panel ---
const assigned = ref<{ data: PermissionRow[]; current_page?:number; last_page?:number } | null>(null)
const assignedSel = ref<number[]>([])
const avail = ref<{ data: PermissionRow[]; current_page?:number; last_page?:number } | null>(null)
const availSel = ref<number[]>([])
const availSearch = ref('')

// --- toast / sync state ---
const toast = ref<{ kind: 'success'|'error'|'info', text: string, details?: string } | null>(null)
const syncing = ref(false)

// utils
function pushToast(kind:'success'|'error'|'info', text:string, details?:string) {
  toast.value = { kind, text, details }
  // auto-hide after 3s (details stay until close)
  setTimeout(() => { if (toast.value?.details == null) toast.value = null }, 3000)
}

// load roles
async function load() {
  loading.value = true
  try {
    const page = await listRoles({ search: search.value, per_page: 50 })
    // normalize paginator
    const arr = Array.isArray(page?.data) ? page.data : (Array.isArray(page) ? page : [])
    roles.value = arr
    rolesTotal.value = page?.total ?? arr.length
  } finally {
    loading.value = false
  }
}

onMounted(load)

// instant search (debounced)
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => load(), 300)
})

// create/edit/delete
function openCreate() {
  isEditing.value = false
  formName.value = ''
  showForm.value = true
}
function openEdit(r: RoleRow) {
  isEditing.value = true
  formName.value = r.name
  sel.value = r
  showForm.value = true
}
async function saveForm() {
  if (isEditing.value && sel.value) await updateRole(sel.value.id, formName.value)
  else await createRole(formName.value)
  showForm.value = false
  await load()
}
async function remove(r: RoleRow) {
  if (!confirm('Delete this role?')) return
  await deleteRole(r.id)
  if (sel.value?.id === r.id) sel.value = null
  await load()
}

// run artisan sync via API
async function runSync(prune=false) {
  if (prune && !confirm('This will delete permissions not used in routes. Continue?')) return
  syncing.value = true
  try {
    const res = await syncPermissionsFromRoutes(prune)
    // show last lines of command output
    const lines = String(res?.output || '').trim().split('\n')
    const tail = lines.slice(-8).join('\n')
    pushToast('success', prune ? 'Permissions refreshed (pruned)' : 'Permissions refreshed', tail || undefined)
    // reload available permissions panel if open
    if (sel.value) await loadAssigned()
    await loadAvailable()
  } catch (e:any) {
    pushToast('error', 'Failed to refresh permissions', e?.response?.data?.message || e?.message)
  } finally {
    syncing.value = false
  }
}

// assignment panel
async function loadAssigned() {
  if (!sel.value) return
  const page = await roleAssigned(sel.value.id, { per_page: 50, cursor: false })
  assigned.value = page
  assignedSel.value = []
}
async function loadAvailable() {
  const page = await searchPermissions({ per_page: 50, search: availSearch.value })
  avail.value = page
  availSel.value = []
}
async function doAttach() {
  if (!sel.value || availSel.value.length === 0) return
  await attachPermissions(sel.value.id, availSel.value)
  pushToast('success', 'Attached permissions')
  await loadAssigned()
  availSel.value = []
}
async function doDetach() {
  if (!sel.value || assignedSel.value.length === 0) return
  await detachPermissions(sel.value.id, assignedSel.value)
  pushToast('success', 'Detached permissions')
  await loadAssigned()
  assignedSel.value = []
}

// load assigned when role changes
watch(() => sel.value?.id, async (id) => {
  if (id) await loadAssigned()
}, { immediate: false })

// load available list immediately and on search
watch(availSearch, () => { loadAvailable() }, { immediate: true })

// helpers
function selectAllAssigned() {
  assignedSel.value = (assigned.value?.data || []).map(p => p.id)
}
function clearAssignedSel() { assignedSel.value = [] }
function selectAllAvail() {
  availSel.value = (avail.value?.data || []).map(p => p.id)
}
function clearAvailSel() { availSel.value = [] }
</script>

<template>
  <div class="space-y-6">
    <!-- Toast -->
    <div
        v-if="toast"
        class="fixed right-4 top-4 z-50 w-[28rem] max-w-[calc(100vw-2rem)] rounded-xl border shadow-lg"
        :class="toast.kind === 'success' ? 'border-green-200 bg-green-50' : toast.kind === 'error' ? 'border-rose-200 bg-rose-50' : 'border-gray-200 bg-white'"
    >
      <div class="flex items-start gap-3 p-3">
        <div class="mt-0.5 text-lg">
          <span v-if="toast.kind==='success'">✅</span>
          <span v-else-if="toast.kind==='error'">⚠️</span>
          <span v-else>ℹ️</span>
        </div>
        <div class="flex-1">
          <div class="text-sm font-medium">{{ toast.text }}</div>
          <pre v-if="toast.details" class="mt-1 max-h-40 overflow-auto whitespace-pre-wrap rounded bg-black/5 p-2 text-[11px]">{{ toast.details }}</pre>
        </div>
        <button class="rounded px-2 py-1 text-sm hover:bg-black/5" @click="toast=null">Close</button>
      </div>
    </div>

    <!-- Header / actions -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="min-w-0 flex-1">
        <h1 class="text-xl font-semibold">Roles</h1>
        <p class="text-sm opacity-70">Total: {{ rolesTotal }}</p>
      </div>

      <div class="relative">
        <input
            v-model="search"
            class="w-64 rounded-xl border px-9 py-2 text-sm"
            placeholder="Search roles…"
        />
        <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
      </div>

      <button class="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm" @click="openCreate">
        + New Role
      </button>

      <div class="ml-auto flex items-center gap-2">
        <button
            class="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
            :disabled="syncing"
            @click="runSync(false)"
            title="Create permissions from route middleware"
        >
          {{ syncing ? 'Refreshing…' : 'Refresh permissions' }}
        </button>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Roles list -->
      <div class="rounded-2xl border shadow-sm">
        <div class="flex items-center justify-between border-b p-3">
          <div class="text-sm font-semibold">All Roles</div>
        </div>

        <ul>
          <li
              v-for="r in roles"
              :key="r.id"
              class="flex items-center gap-3 border-t p-3 hover:bg-gray-50"
              :class="sel?.id===r.id ? 'bg-indigo-50/50' : ''"
          >
            <button class="truncate text-left hover:underline" @click="sel = r">
              <div class="font-medium">{{ r.name }}</div>
              <div class="text-xs opacity-60">ID: {{ r.id }}</div>
            </button>
            <span class="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs">
            </span>
            <button class="rounded border px-2 py-1 text-xs" @click="openEdit(r)">Edit</button>
            <button class="rounded border px-2 py-1 text-xs" @click="remove(r)">Delete</button>
          </li>

          <li v-if="Array.isArray(roles) && roles.length === 0" class="p-3 text-sm opacity-70">
            No roles
          </li>
        </ul>
      </div>

      <!-- Assignment -->
      <div class="rounded-2xl border shadow-sm">
        <div class="flex items-center justify-between border-b p-3">
          <div class="text-sm font-semibold">
            Permissions for: <span class="font-bold">{{ sel?.name || '—' }}</span>
          </div>
          <div v-if="sel" class="text-xs opacity-60">Role ID: {{ sel.id }}</div>
        </div>

        <div v-if="sel" class="grid gap-4 p-3 md:grid-cols-2">
          <!-- Assigned -->
          <div class="overflow-hidden rounded-xl border">
            <div class="flex items-center justify-between border-b bg-gray-50 p-2">
              <div class="text-xs font-semibold">Assigned</div>
              <div class="flex items-center gap-2 text-xs">
                <button class="rounded border px-2 py-0.5" @click="selectAllAssigned">Select all</button>
                <button class="rounded border px-2 py-0.5" @click="clearAssignedSel">Clear</button>
              </div>
            </div>
            <div class="max-h-80 space-y-1 overflow-auto p-2">
              <label v-for="p in (assigned?.data||[])" :key="p.id" class="flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="assignedSel" :value="p.id" />
                <span class="truncate">{{ p.name }}</span>
                <span class="ml-auto text-[11px] opacity-50">#{{ p.id }}</span>
              </label>
              <div v-if="!assigned?.data?.length" class="text-xs opacity-70">None</div>
            </div>
            <div class="border-t p-2">
              <button class="rounded bg-rose-600 px-3 py-1 text-sm text-white disabled:opacity-50" @click="doDetach" :disabled="!assignedSel.length">
                Detach selected
              </button>
            </div>
          </div>

          <!-- Available -->
          <div class="overflow-hidden rounded-xl border">
            <div class="flex items-center gap-2 border-b bg-gray-50 p-2">
              <div class="text-xs font-semibold">Available</div>
              <input v-model="availSearch" class="ml-auto w-40 rounded border px-2 py-1 text-sm" placeholder="Search…" />
            </div>
            <div class="max-h-80 space-y-1 overflow-auto p-2">
              <label v-for="p in (avail?.data||[])" :key="p.id" class="flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="availSel" :value="p.id" />
                <span class="truncate">{{ p.name }}</span>
                <span class="ml-auto text-[11px] opacity-50">#{{ p.id }}</span>
              </label>
              <div v-if="!avail?.data?.length" class="text-xs opacity-70">No results</div>
            </div>
            <div class="border-t p-2">
              <button class="rounded bg-green-600 px-3 py-1 text-sm text-white disabled:opacity-50" @click="doAttach" :disabled="!availSel.length || !sel">
                Attach selected
              </button>
              <div class="mt-2 text-[11px] opacity-60">Search runs instantly.</div>
            </div>
          </div>
        </div>

        <div v-else class="p-3 text-sm opacity-70">Select a role to manage permissions.</div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div class="w-full max-w-md rounded-2xl border bg-white p-4 shadow-2xl">
        <div class="mb-2 text-lg font-semibold">{{ isEditing ? 'Edit role' : 'Create role' }}</div>
        <input v-model="formName" class="w-full rounded border px-3 py-2 text-sm" placeholder="Role name" />
        <div class="mt-3 flex justify-end gap-2">
          <button class="rounded border px-3 py-2 text-sm" @click="showForm = false">Cancel</button>
          <button class="rounded bg-indigo-600 px-3 py-2 text-sm text-white" @click="saveForm">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
