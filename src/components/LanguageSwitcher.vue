<script setup lang="ts">
import { computed } from 'vue'
import { i18n, setLocale } from '@/i18n'

const locale = computed({
  get: () => i18n.global.locale.value as 'am' | 'en',
  set: (v: 'am' | 'en') => setLocale(v),
})
</script>

<template>
  <select v-model="locale" class="rounded-xl border px-3 py-2 text-sm">
    <option value="am">Հայերեն</option>
    <option value="en">English</option>
  </select>
</template>