<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { PageNode } from '@/utils/pagesApi'
import { iconMap } from '@/components/icons/map'
import {useI18n} from "vue-i18n";

const props = defineProps<{ node: PageNode }>()
const route = useRoute()

const hasChildren = computed(() => (props.node.children?.length ?? 0) > 0)

// open if current route lives under this node (simple heuristic)
const isActive = computed(() => route.path === props.node.path)
const isAncestorActive = computed(() =>
    (props.node.children ?? []).some(c => route.path.startsWith(c.path))
)

const open = ref(isActive.value || isAncestorActive.value)
watch(() => route.path, () => {
  open.value = isActive.value || isAncestorActive.value
})
const { t, d } = useI18n()

const Icon = computed(() => (props.node.icon && iconMap[props.node.icon]) || null)
</script>

<template>
  <li>
    <!-- Parent as toggle when it has children -->
    <button
        v-if="hasChildren"
        type="button"
        @click="open = !open"
        :class="[
        'w-full flex justify-between gap-2 rounded-lg px-3 py-2 text-sm transition',
        (isActive || isAncestorActive)
          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800/70'
      ]"
    >
      <div class="flex gap-2">
        <component v-if="Icon" :is="Icon" class="h-5 w-5 opacity-80" />
        <span v-else class="inline-block h-5 w-5 text-center opacity-70">•</span>
        <span class="flex-1 truncate">{{ t(node.key) }}</span>
      </div>
      <span class="ml-2 text-xs opacity-70">{{ open ? '▾' : '▸' }}</span>
    </button>

    <!-- Leaf as normal link -->
    <RouterLink
        v-else
        :to="node.path"
        :class="[
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition',
        route.path === node.path
          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800/70'
      ]"
    >
      <component v-if="Icon" :is="Icon" class="h-5 w-5 opacity-80" />
      <span v-else class="inline-block h-5 w-5 text-center opacity-70">•</span>
      <span class="truncate">{{ t(node.key) }}</span>
    </RouterLink>

    <!-- Children -->
    <transition name="fade">
      <ul
          v-if="hasChildren && open"
          class="mt-1 ml-3 space-y-1 border-l border-gray-200 pl-2 dark:border-gray-800"
      >
        <SidebarNode v-for="c in node.children" :key="c.id" :node="c" />
      </ul>
    </transition>
  </li>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-2px); }
</style>
