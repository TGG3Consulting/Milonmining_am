<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { CheckCircleIcon, ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'

const { t, d } = useI18n()
const email = ref('')
const password = ref('')
const show = ref(false)
const pending = ref(false)
const err = ref<string | null>(null)
const ok = ref(false)

const auth = useAuth()
const router = useRouter()
const route = useRoute()

async function submit() {
  if (pending.value) return
  err.value = null; ok.value = false; pending.value = true
  try {
    await auth.login(email.value.trim(), password.value)
    await auth.loadMe()
    ok.value = true
    const next = (route.query.next as string) || '/'
    router.replace(next)
  } catch (e: any) {
    err.value = e?.response?.data?.message || t('auth.failed')
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
    <div class="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-900/30"></div>
    <div class="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-fuchsia-200/40 blur-3xl dark:bg-fuchsia-900/30"></div>

    <!-- card -->
    <div class="relative grid min-h-screen place-items-center p-4">
      <div class="w-full max-w-md rounded-2xl border border-white/60 bg-white/70 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/60">
        <div class="mb-6 flex items-center gap-3">
          <div>
            <div class="text-lg font-semibold">{{ t('brand.name') }}</div>
            <div class="text-xs opacity-60">{{ t('auth.subtitle') }}</div>
          </div>
        </div>

        <div v-if="ok" class="mb-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-green-700 dark:bg-green-900/30 dark:text-green-200">
          <CheckCircleIcon class="h-5 w-5" />
          <span class="text-sm">{{ t('auth.signedIn') }}</span>
        </div>
        <div v-if="err" class="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-700 dark:bg-red-900/30 dark:text-red-200">
          <ExclamationCircleIcon class="h-5 w-5" />
          <span class="text-sm">{{ err }}</span>
        </div>

        <form class="space-y-4" @submit.prevent="submit">
          <div>
            <label class="mb-1 block text-sm font-medium">{{ t('auth.email') }}</label>
            <input
                v-model="email"
                type="email"
                autocomplete="username"
                placeholder="you@example.com"
                class="w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-950"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">{{ t('auth.password') }}</label>
            <div class="relative">
              <input
                  v-model="password"
                  :type="show ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  class="w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2 pr-10 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-950"
                  @keyup.enter="submit"
              />
              <button
                  type="button"
                  class="absolute inset-y-0 right-2 grid place-items-center rounded-lg px-2 text-gray-500 hover:text-gray-700 dark:text-gray-300"
                  @click="show = !show"
                  :aria-label="show ? t('auth.hide') : t('auth.show')"
              >
                <EyeIcon v-if="!show" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <button type="submit" :disabled="pending"
                  class="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-indigo-700 disabled:opacity-50">
            {{ pending ? t('auth.signingIn') : t('auth.signin') }}
          </button>

          <div class="flex items-center justify-between text-xs opacity-70">
<!--            <span v-text="$t('footer.copyright', { year: new Date().getFullYear() })" />-->
          </div>
        </form>
      </div>
    </div>
  </div>
</template>