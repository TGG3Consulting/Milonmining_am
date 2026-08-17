<script setup lang="ts">
import { ref, onMounted } from "vue";
import UserForm from "../components/users/UserForm.vue";
import { listUsers, deleteUser } from "@/utils/usersApi";
import { listRoles } from "@/utils/rolesApi";

interface Role { id: number; name: string }
interface User { id: number; name: string; email: string; roles: Role[] }

const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const loading = ref(false);
const search = ref("");
const showForm = ref(false);
const editingUser = ref<User | null>(null);

async function loadUsers() {
  loading.value = true;
  try {
    const res = await listUsers({ search: search.value });
    users.value = res.data;
  } finally {
    loading.value = false;
  }
}

async function loadRoles() {
  const res = await listRoles();
  roles.value = res;
}

function openCreate() {
  editingUser.value = null;
  showForm.value = true;
}

function openEdit(user: User) {
  editingUser.value = user;
  showForm.value = true;
}

async function handleDelete(id: number) {
  if (!confirm("Delete this user?")) return;
  await deleteUser(id);
  await loadUsers();
}

onMounted(async () => {
  await loadRoles();
  await loadUsers();
});
</script>

<template>
  <div>
    <!-- Search -->
    <div class="mb-4 flex gap-2">
      <input
          v-model="search"
          @input="loadUsers"
          placeholder="Search users…"
          class="rounded-xl border px-3 py-2 text-sm w-64"
      />
      <button class="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm" @click="openCreate">
        New User
      </button>
    </div>

    <!-- Table card -->
    <div class="bg-white rounded-xl shadow">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
        <tr>
          <th class="text-left p-3 font-medium">Name</th>
          <th class="text-left p-3 font-medium">Email</th>
          <th class="text-left p-3 font-medium">Roles</th>
          <th class="text-right p-3 font-medium">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="loading">
          <td colspan="4" class="p-4 text-center text-gray-500">Loading…</td>
        </tr>
        <tr v-else-if="!users.length">
          <td colspan="4" class="p-4 text-center text-gray-400 italic">No users</td>
        </tr>
        <tr
            v-for="u in users"
            :key="u.id"
            class="border-b hover:bg-gray-50"
        >
          <td class="p-3">{{ u.name }}</td>
          <td class="p-3">{{ u.email }}</td>
          <td class="p-3">
              <span
                  v-for="r in u.roles"
                  :key="r.id"
                  class="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs mr-1"
              >
                {{ r.name }}
              </span>
          </td>
          <td class="p-3 text-right space-x-2 text-xs">
            <button
                class="px-3 py-1 rounded border"
                @click="openEdit(u)"
            >
              Edit
            </button>
            <button
                class="px-3 py-1 rounded border"
                @click="handleDelete(u.id)"
            >
              Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal form -->
    <UserForm
        v-if="showForm"
        :roles="roles"
        :user="editingUser"
        @close="showForm = false"
        @saved="() => { showForm = false; loadUsers(); }"
    />
  </div>
</template>
