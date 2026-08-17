<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/utils/api'

type Perm = { id:number; name:string; guard_name:string }
const list = ref<Perm[]>([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    // Adjust if your API path differs; shape should be { ok, data: [...] }
    const { data } = await api.get('/permissions')
    list.value = data.data || []
  } finally {
    loading.value = false
  }
}
onMounted(load)
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-xl font-semibold">Permissions</h1>
      <p class="opacity-70 text-sm">View-only list (add manage UI later)</p>
    </div>

    <div class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead class="bg-gray-50/60 dark:bg-gray-900/60">
        <tr>
          <th class="px-3 py-2 text-left text-xs font-medium uppercase">Name</th>
          <th class="px-3 py-2 text-left text-xs font-medium uppercase">Guard</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
        <tr v-for="p in list" :key="p.id">
          <td class="px-3 py-2 text-sm">{{ p.name }}</td>
          <td class="px-3 py-2 text-sm">{{ p.guard_name }}</td>
        </tr>
        </tbody>
      </table>
      <div v-if="loading" class="p-3 text-sm opacity-70">Loading…</div>
      <div v-if="!loading && !list.length" class="p-3 text-sm opacity-70">No permissions</div>
    </div>
  </div>
</template>
