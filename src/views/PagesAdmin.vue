<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import PageForm from '@/components/pages/PageForm.vue'
import {
  listPages, createPage, updatePage, deletePage, reorderPages,
  type PageNode,
} from '@/utils/pagesApi'

// --- data ---
const all = ref<PageNode[]>([])
const loading = ref(false)
const dirty = ref(false)
const search = ref('')

// modal
const showForm = ref(false)
const editing = ref<PageNode | null>(null)

// collapse control for parent rows
const open = ref<Set<number>>(new Set())

// local working arrays for DnD (roots and children by parent id)
const roots = ref<PageNode[]>([])
const childrenMap = ref<Record<number, PageNode[]>>({})

// --- helpers ---
function rebuildLocal() {
  const byParent: Record<number, PageNode[]> = {}
  const r: PageNode[] = []
  ;[...all.value]
      .sort((a, b) => (a.parent_id ?? -1) - (b.parent_id ?? -1) || a.sort - b.sort || a.id - b.id)
      .forEach(p => {
        if (p.parent_id == null) {
          r.push(p)
        } else {
          (byParent[p.parent_id] ||= []).push(p)
        }
      })
  roots.value = r
  childrenMap.value = byParent
}
watch(all, rebuildLocal, { immediate: true })

const filteredRoots = computed(() => {
  if (!search.value) return roots.value
  const s = search.value.toLowerCase()
  // if a child matches, keep its parent visible
  const match = (p: PageNode) =>
      p.label.toLowerCase().includes(s) ||
      p.key.toLowerCase().includes(s) ||
      p.path.toLowerCase().includes(s) ||
      (p.permissions ?? []).some(x => x.toLowerCase().includes(s))
  return roots.value.filter(p =>
      match(p) ||
      (childrenMap.value[p.id]?.some(match) ?? false)
  )
})

function markDirty() { dirty.value = true }
function toggleActive(p: PageNode) { p.is_active = !p.is_active; markDirty() }

// compute payload for /pages/reorder from local arrays
function buildReorderPayload() {
  const items: Array<{id:number; parent_id:number|null; sort:number}> = []
  filteredRoots.value.forEach((p, i) => {
    items.push({ id: p.id, parent_id: null, sort: i })
    ;(childrenMap.value[p.id] || []).forEach((c, j) => {
      items.push({ id: c.id, parent_id: p.id, sort: j })
    })
  })
  return items
}

// --- crud ---
async function load() {
  loading.value = true
  try { all.value = await listPages() }
  finally { loading.value = false }
}

function startCreate() {
  editing.value = null
  showForm.value = true
}
function startEdit(row: PageNode) {
  editing.value = row
  showForm.value = true
}

async function handleSave(payload: Partial<PageNode>) {
  if (editing.value) await updatePage(editing.value.id, payload)
  else await createPage(payload)
  showForm.value = false
  await load()
  dirty.value = false
}

async function handleDelete(id: number) {
  if (!confirm('Delete this page?')) return
  await deletePage(id)
  await load()
  dirty.value = false
}

async function saveOrder() {
  await reorderPages(buildReorderPayload())
  await load()
  dirty.value = false
}

onMounted(load)
</script>

<template>
  <div class="space-y-4">
    <!-- toolbar -->
    <div class="flex flex-wrap items-center gap-2">
      <input
          v-model="search"
          class="rounded-xl border px-3 py-2 text-sm w-64"
          placeholder="Search pages…"
      />
      <button class="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm" @click="startCreate">
        New Page
      </button>
      <button
          class="rounded-xl border px-4 py-2 text-sm"
          :class="dirty ? 'border-indigo-600 text-indigo-700' : 'opacity-50 cursor-not-allowed'"
          :disabled="!dirty"
          @click="saveOrder"
      >
        Save Order
      </button>
    </div>

    <!-- list -->
    <div class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
      <div class="hidden md:grid grid-cols-[72px_1fr_1fr_220px_120px] gap-2 px-3 py-2 text-xs font-semibold uppercase bg-gray-50/70 dark:bg-gray-900/50">
        <div>Sort</div>
        <div>Label</div>
        <div>Path</div>
        <div>Permissions</div>
        <div></div>
      </div>

      <!-- ROOTS draggable -->
      <draggable
          v-model="roots"
          item-key="id"
          handle=".drag-handle"
          ghost-class="opacity-40"
          @end="markDirty"
      >
        <template #item="{ element: p }">
          <div class="border-t border-gray-100 dark:border-gray-800">
            <!-- parent row -->
            <div class="grid grid-cols-1 md:grid-cols-[72px_1fr_1fr_220px_120px] gap-2 items-center px-3 py-2">
              <div class="flex items-center gap-2">
                <button class="drag-handle rounded border px-2 text-xs">≡</button>
                <button
                    class="rounded border px-2 text-xs"
                    @click="open.has(p.id) ? open.delete(p.id) : open.add(p.id)"
                >
                  {{ open.has(p.id) ? '▾' : '▸' }}
                </button>
              </div>

              <div>
                <div class="font-medium">{{ p.label }}</div>
                <div class="text-xs opacity-60">{{ p.key }}</div>
              </div>

              <div class="text-sm">{{ p.path }}</div>

              <div class="flex flex-wrap gap-1">
                <span v-if="!p.permissions || !p.permissions.length" class="text-xs opacity-60">—</span>
                <span
                    v-for="perm in (p.permissions || [])"
                    :key="perm"
                    class="rounded-full bg-indigo-50 text-indigo-700 px-2 py-0.5 text-xs dark:bg-indigo-900/30 dark:text-indigo-200"
                >{{ perm }}</span>
              </div>

              <div class="flex justify-end gap-2">
<!--                <button-->
<!--                    class="rounded border px-2 py-1 text-xs"-->
<!--                    :class="p.is_active ? 'border-green-600 text-green-700' : 'opacity-60'"-->
<!--                    @click="toggleActive(p)"-->
<!--                    title="Toggle active"-->
<!--                >-->
<!--                  {{ p.is_active ? 'Active' : 'Inactive' }}-->
<!--                </button>-->
                <button class="rounded border px-3 py-1 text-xs" @click="startEdit(p)">Edit</button>
                <button class="rounded border px-3 py-1 text-xs" @click="handleDelete(p.id)">Delete</button>
              </div>
            </div>

            <!-- children draggable (only when expanded) -->
            <div v-if="open.has(p.id)" class="bg-gray-50/40 dark:bg-gray-900/30">
              <draggable
                  v-model="childrenMap[p.id]"
                  item-key="id"
                  handle=".drag-handle"
                  ghost-class="opacity-40"
                  @end="markDirty"
              >
                <template #item="{ element: c }">
                  <div class="grid grid-cols-1 md:grid-cols-[72px_1fr_1fr_220px_120px] gap-2 items-center px-3 py-2">
                    <div class="flex items-center gap-2 pl-6">
                      <button class="drag-handle rounded border px-2 text-xs">≡</button>
                    </div>

                    <div>
                      <div class="font-medium">{{ c.label }}</div>
                      <div class="text-xs opacity-60">{{ c.key }}</div>
                    </div>

                    <div class="text-sm">{{ c.path }}</div>

                    <div class="flex flex-wrap gap-1">
                      <span v-if="!c.permissions || !c.permissions.length" class="text-xs opacity-60">—</span>
                      <span
                          v-for="perm in (c.permissions || [])"
                          :key="perm"
                          class="rounded-full bg-indigo-50 text-indigo-700 px-2 py-0.5 text-xs dark:bg-indigo-900/30 dark:text-indigo-200"
                      >{{ perm }}</span>
                    </div>

                    <div class="flex justify-end gap-2">
<!--                      <button-->
<!--                          class="rounded border px-2 py-1 text-xs"-->
<!--                          :class="c.is_active ? 'border-green-600 text-green-700' : 'opacity-60'"-->
<!--                          @click="toggleActive(c)"-->
<!--                          title="Toggle active"-->
<!--                      >-->
<!--                        {{ c.is_active ? 'Active' : 'Inactive' }}-->
<!--                      </button>-->
                      <button class="rounded border px-3 py-1 text-xs" @click="startEdit(c)">Edit</button>
                      <button class="rounded border px-3 py-1 text-xs" @click="handleDelete(c.id)">Delete</button>
                    </div>
                  </div>
                </template>
              </draggable>

              <!-- add child shortcut -->
              <div class="px-3 pb-3">
                <button
                    class="rounded-xl border px-3 py-1.5 text-xs"
                    @click="() => { editing = { ...p, id: 0 as any, key: '', label: '', path: '', parent_id: p.id } as any; showForm = true }"
                >
                  + Add child to {{ p.label }}
                </button>
              </div>
            </div>
          </div>
        </template>
      </draggable>

      <div v-if="loading" class="p-4 text-sm opacity-70">Loading…</div>
      <div v-if="!loading && !filteredRoots.length" class="p-4 text-sm opacity-70">No results</div>
    </div>

    <!-- modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
      <div class="modal-panel">
        <div class="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
          <h2 class="text-lg font-semibold">{{ editing ? 'Edit Page' : 'Create Page' }}</h2>
          <button class="btn-icon" @click="showForm = false" aria-label="Close">✕</button>
        </div>
        <div class="p-5">
          <PageForm
              :all-pages="all"
              :initial="editing || undefined"
              @submit="handleSave"
              @cancel="() => (showForm = false)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
