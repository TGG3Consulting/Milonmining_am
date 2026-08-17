<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/stores/auth'
import Sidebar from '@/components/layout/Sidebar.vue'

const route = useRoute()
const auth = useAuth()

// Show the app shell (sidebar) only when authenticated and not on /login
// @ts-ignore
const showShell = computed(() => auth.isAuthed && route.path !== '/login')
</script>

<template>
  <!-- Public area (e.g., /login): no nav/chrome -->
  <div v-if="!showShell">
    <router-view />
  </div>

  <!-- Authenticated app shell with left sidebar -->
  <div v-else class="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
    <aside class="hidden md:block border-r border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/70">
      <Sidebar />
    </aside>

    <main class="h-screen overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <!-- (optional) top spacer or header could go here -->
      <div class="p-4">
        <router-view />
      </div>
    </main>
  </div>
</template>
