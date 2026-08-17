<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'                 // ✅ add
import type { PageNode } from '@/utils/pagesApi'
import IconPreview from '@/components/ui/IconPreview.vue'

const { t } = useI18n()                            // ✅ add

const props = defineProps<{ allPages: PageNode[]; initial?: Partial<PageNode> }>()
const emit = defineEmits<{ (e:'submit', payload: Partial<PageNode>):void; (e:'cancel'):void }>()

const model = ref<Partial<PageNode>>({
  key: '', label: '', path: '', icon: '',
  permissions: [], parent_id: null, sort: 0, is_active: true,
  ...props.initial,
})
watch(() => props.initial, (v) => { model.value = { ...model.value, ...(v || {}) } })

const permissionText = computed({
  get: () => (model.value.permissions ?? []).join(', '),
  set: (val: string) => {
    const arr = val.split(',').map(s => s.trim()).filter(Boolean)
    model.value.permissions = arr.length ? arr : null
  }
})
function removePerm(p: string) {
  const arr = (model.value.permissions ?? []).filter(x => x !== p)
  model.value.permissions = arr.length ? arr : null
}
</script>

<template>
  <form class="space-y-7" @submit.prevent="emit('submit', model)">
    <!-- Basics -->
    <div class="space-y-3">
      <div class="section">{{ t('pageForm.sections.basics') }}</div>   <!-- ✅ -->
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="label">{{ t('pageForm.key') }}</label>          <!-- ✅ -->
          <input v-model="model.key" class="input" placeholder="dashboard" required />
          <p class="hint">{{ t('pageForm.hints.key') }}</p>             <!-- ✅ -->
        </div>
        <div>
          <label class="label">{{ t('pageForm.label') }}</label>        <!-- ✅ -->
          <input v-model="model.label" class="input" placeholder="Dashboard" required />
        </div>
        <div>
          <label class="label">{{ t('pageForm.path') }}</label>         <!-- ✅ -->
          <input v-model="model.path" class="input" placeholder="/dashboard" required />
          <p class="hint">{{ t('pageForm.hints.path') }}</p>            <!-- ✅ -->
        </div>
        <div>
          <label class="label">{{ t('pageForm.icon') }}</label>         <!-- ✅ -->
          <IconPreview :name="(model.icon as string)">
            <input v-model="model.icon" class="input" placeholder="HomeIcon" />
          </IconPreview>
          <p class="hint">{{ t('pageForm.hints.icon') }}</p>            <!-- ✅ -->
        </div>
      </div>
    </div>

    <!-- Access -->
    <div class="space-y-3">
      <div class="section">{{ t('pageForm.sections.access') }}</div>    <!-- ✅ -->
      <div>
        <label class="label">{{ t('pageForm.permissions') }}</label>    <!-- ✅ -->
        <input v-model="permissionText" class="input" placeholder="roles.view, users.manage" />
        <div class="mt-2 flex flex-wrap gap-1">
          <template v-if="model.permissions && model.permissions.length">
            <span v-for="perm in model.permissions" :key="perm" class="chip">
              {{ perm }}
              <button type="button" class="ml-1 opacity-70 hover:opacity-100" @click="removePerm(perm)">×</button>
            </span>
          </template>
          <span v-else class="text-xs opacity-60">{{ t('pageForm.hints.none') }}</span> <!-- ✅ -->
        </div>
      </div>
    </div>

    <!-- Placement & Status -->
    <div class="space-y-3">
      <div class="section">{{ t('pageForm.sections.placement') }}</div> <!-- ✅ -->
      <div class="grid gap-4 sm:grid-cols-3">
        <div>
          <label class="label">{{ t('pageForm.parent') }}</label>       <!-- ✅ -->
          <select v-model="model.parent_id" class="select">
            <option :value="null">— {{ t('pageForm.hints.none') }} —</option> <!-- ✅ -->
            <option v-for="p in props.allPages" :key="p.id" :value="p.id">{{ p.label }}</option>
          </select>
        </div>
        <div>
          <label class="label">{{ t('pageForm.sort') }}</label>         <!-- ✅ -->
          <input v-model.number="model.sort" type="number" min="0" class="input" />
        </div>
        <div>
          <label class="label">{{ t('pageForm.active') }}</label>       <!-- ✅ -->
          <button
              type="button"
              class="switch"
              :class="model.is_active ? 'bg-indigo-600' : 'bg-gray-300'"
              @click="model.is_active = !model.is_active"
              :aria-pressed="model.is_active"
          >
            <span class="switch-dot" :class="model.is_active ? 'translate-x-5' : ''"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 pt-1">
      <button type="submit" class="btn btn-primary">{{ t('pageForm.save') }}</button>   <!-- ✅ -->
      <button type="button" class="btn btn-ghost" @click="emit('cancel')">{{ t('pageForm.cancel') }}</button> <!-- ✅ -->
    </div>
  </form>
</template>
