<script setup lang="ts">
import { useAuth } from '@/stores/auth'
import {useI18n} from "vue-i18n";
const { t } = useI18n()

const auth = useAuth()
</script>

<template>
  <div class="p-6 space-y-2">
    <h1 class="text-2xl font-semibold">{{ t('dashboard') }}</h1>
    <p>{{ t('welcome') }}, {{ auth.user?.name }}</p>

    <div class="flex gap-2 mt-4">
      <button @click="auth.logout()" class="border rounded px-3 py-1">{{ t('auth.logout') }}</button>
    </div>
  </div>
</template>