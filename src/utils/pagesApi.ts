import api from '@/utils/api.ts'

export type PageNode = {
    id: number
    key: string
    label: string
    path: string
    icon?: string | null
    permissions?: string[] | null
    sort: number
    parent_id?: number | null
    is_active: boolean
    children?: PageNode[]
}

export async function fetchPagesTree(): Promise<PageNode[]> {
    const { data } = await api.get('/pages/tree')
    return data.data as PageNode[]
}

export async function listPages(): Promise<PageNode[]> {
    const { data } = await api.get('/pages')
    return data.data as PageNode[]
}

export async function createPage(payload: Partial<PageNode>) {
    const { data } = await api.post('/pages', payload)
    return data.data as PageNode
}

export async function updatePage(id: number, payload: Partial<PageNode>) {
    const { data } = await api.patch(`/pages/${id}`, payload)
    return data.data as PageNode
}

export async function deletePage(id: number) {
    await api.delete(`/pages/${id}`)
}

export async function reorderPages(rows: Array<{id:number; parent_id:number|null; sort:number}>) {
    await api.post('/pages/reorder', { items: rows })
}