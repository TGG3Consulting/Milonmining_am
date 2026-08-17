<script setup lang="ts">
import { computed } from 'vue'
import { iconMap } from '@/components/icons/map' // you already have this map
const props = defineProps<{ name?: string | null }>()
const Icon = computed(() => (props.name && iconMap[props.name]) || null)
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="grid h-9 w-9 place-items-center rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <component v-if="Icon" :is="Icon" class="h-5 w-5 opacity-80" />
      <span v-else class="text-xs opacity-50">—</span>
    </div>
    <slot />
  </div>
</template>
