import api from '@/utils/api'

export type RoleRow = { id:number; name:string; permissions_count:number }
export type PermissionRow = { id:number; name:string }

export async function listRoles(params:{search?:string; page?:number; per_page?:number} = {}) {
    const { data } = await api.get('/roles', { params })
    return data.data
}
export async function createRole(name:string) {
    const { data } = await api.post('/roles', { name })
    return data.data as RoleRow
}
export async function updateRole(id:number, name:string) {
    const { data } = await api.patch(`/roles/${id}`, { name })
    return data.data as RoleRow
}
export async function deleteRole(id:number) {
    await api.delete(`/roles/${id}`)
}

export async function syncPermissionsFromRoutes(prune=false) {
    const { data } = await api.post('/roles/sync-permissions', { prune })
    return data.data
}

export async function roleAssigned(roleId:number, params:{search?:string; per_page?:number; cursor?:boolean} = {}) {
    const { data } = await api.get(`/roles/${roleId}/permissions`, { params })
    return data.data // paginator
}
export async function attachPermissions(roleId:number, ids:number[]) {
    const { data } = await api.post(`/roles/${roleId}/permissions/attach`, { permission_ids: ids })
    return data.data
}
export async function detachPermissions(roleId:number, ids:number[]) {
    const { data } = await api.post(`/roles/${roleId}/permissions/detach`, { permission_ids: ids })
    return data.data
}
export async function searchPermissions(params:{search?:string; per_page?:number; page?:number} = {}) {
    const { data } = await api.get('/permissions', { params })
    return data.data // paginator
}