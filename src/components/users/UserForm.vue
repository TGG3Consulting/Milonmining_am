<script setup lang="ts">
import { ref, watch, computed, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import type { UserRow } from "@/utils/usersApi";
import type { RoleRow } from "@/utils/rolesApi";
import { updateUser, createUser } from "@/utils/usersApi";

const { t } = useI18n();

// ---- Props (roles defaults to [] to avoid "Invalid prop" error) ----
const props = withDefaults(defineProps<{
  user?: Partial<UserRow> | null;
  roles?: RoleRow[];
}>(), {
  roles: () => []
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved"): void;
}>();

// ---- Local form model (what backend expects) ----
type UserFormModel = {
  id?: number;
  name: string;
  email: string;
  password?: string;     // required on create by your DTO; optional on edit
  role_ids: number[];    // ALWAYS an array
};

const model = ref<UserFormModel>({
  id: undefined,
  name: "",
  email: "",
  password: "",
  role_ids: [],
});

const isEdit = computed(() => !!model.value.id);

// Keep model in sync with incoming prop
watch(
    () => props.user,
    (u) => {
      model.value = {
        id: u?.id,
        name: u?.name ?? "",
        email: u?.email ?? "",
        // leave password blank by default (only required on create)
        password: "",
        role_ids: u?.roles?.map(r => r.id) ?? [],
      };
    },
    { immediate: true }
);

// ---- Submit ----
async function handleSubmit() {
  // Build minimal payload (avoid sending undefined fields)
  const base = {
    name: model.value.name,
    email: model.value.email,
    role_ids: model.value.role_ids,
  };

  if (isEdit.value) {
    const payload = {
      ...base,
      ...(model.value.password ? { password: model.value.password } : {}),
    };
    await updateUser(model.value.id as number, payload);
  } else {
    // On create, your DTO requires password + at least one role
    const payload = {
      ...base,
      password: model.value.password || "", // ensure present
    };
    await createUser(payload);
  }

  emit("saved");
}
</script>
<template>
  <!-- Modal backdrop -->
  <div class="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
    <!-- Modal card -->
    <div class="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
      <h2 class="text-lg font-semibold mb-4">
        {{ model.id ? t("user.editUser") : t("user.newUser") }}
      </h2>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Basics -->
        <div class="space-y-3">
          <div>
            <label class="label">{{ t("user.name") }}</label>
            <input
                v-model="model.name"
                class="input"
                type="text"
                required
                placeholder="John Doe"
            />
          </div>
          <div>
            <label class="label">{{ t("user.email") }}</label>
            <input
                v-model="model.email"
                class="input"
                type="email"
                required
                placeholder="john@example.com"
            />
          </div>
          <div>
            <label class="label">{{ t("user.password") }}</label>
            <input
                v-model="model.password"
                class="input"
                type="password"
                required
            />
          </div>
        </div>

        <!-- Roles -->
        <div class="space-y-2">
          <label class="label">{{ t("user.roles") }}</label>
          <div class="flex flex-wrap gap-2">
            <label
                v-for="role in props.roles"
                :key="role.id"
                class="flex items-center gap-2 px-3 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
            >
              <input
                  type="checkbox"
                  :value="role.id"
                  v-model="model.role_ids"
              />
              <span>{{ role.name }}</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 pt-4">
          <button type="submit" class="btn btn-primary">
            {{ t("user.save") }}
          </button>
          <button type="button" class="btn btn-ghost" @click="emit('close')">
            {{ t("user.cancel") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
