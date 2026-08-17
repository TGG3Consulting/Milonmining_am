<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useAuth } from '@/stores/auth'
import { fetchPagesTree, type PageNode } from '@/utils/pagesApi'
import SidebarNode from './SidebarNode.vue'
import {useI18n} from "vue-i18n";

const auth = useAuth()
const tree = ref<PageNode[] | null>(null)
const loading = ref(false)
const { t, d } = useI18n()

async function load() {
  if (!auth.isAuthed) return
  loading.value = true
  try { tree.value = await fetchPagesTree() }
  finally { loading.value = false }
}

function doLogout() {
  // store handles token revoke + redirect to /login
  auth.logout()
}

onMounted(load)
watch(() => auth.isAuthed, () => load())
</script>

<template>
  <div class="flex h-screen flex-col">
    <!-- User -->
    <div class="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-3">
<!--        <div class="h-8 w-8 rounded-lg bg-indigo-600"></div>-->
        <div class="min-w-0">
          <div class="truncate text-sm font-semibold">{{ auth.user?.name }}</div>
          <div class="truncate text-xs opacity-60">{{ auth.user?.email }}</div>
        </div>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-2 py-3">
      <ul class="space-y-1">
        <template v-if="tree && tree.length">
          <SidebarNode v-for="n in tree" :key="n.id" :node="n" />
        </template>
        <li v-else class="px-3 py-2 text-sm opacity-60">
          {{ loading ? t('loading...') : 'No pages' }}
        </li>
      </ul>
    </nav>
    <div class="my-2 border-t border-gray-200 dark:border-gray-800">
      <button
          class="w-full justify-center flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800/70"
          @click="doLogout"
      >
        <span>{{ t('auth.logout') }}</span>
      </button>
    </div>
  </div>
</template>
