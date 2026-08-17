import api from '@/utils/api'

export type UserRow = {
    id: number
    name: string
    email: string
    roles_count: number
}

export async function listUsers(params: { search?: string; page?: number; per_page?: number } = {}) {
    const { data } = await api.get('/users', { params })
    return data.data // paginator or array depending on backend
}

export async function createUser(payload: { name: string; email: string; password: string; role_ids?: number[] }) {
    const { data } = await api.post('/users', payload)
    return data.data as UserRow
}

export async function updateUser(id: number, payload: { name?: string; email?: string; password?: string; role_ids?: number[] }) {
    const { data } = await api.patch(`/users/${id}`, payload)
    return data.data as UserRow
}

export async function deleteUser(id: number) {
    await api.delete(`/users/${id}`)
}

export async function userRoles(userId: number, params: { search?: string; per_page?: number; cursor?: boolean } = {}) {
    const { data } = await api.get(`/users/${userId}/roles`, { params })
    return data.data // paginator
}

export async function attachRoles(userId: number, ids: number[]) {
    const { data } = await api.post(`/users/${userId}/roles/attach`, { role_ids: ids })
    return data.data
}

export async function detachRoles(userId: number, ids: number[]) {
    const { data } = await api.post(`/users/${userId}/roles/detach`, { role_ids: ids })
    return data.data
}
