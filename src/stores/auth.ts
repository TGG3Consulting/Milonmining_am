import { defineStore } from 'pinia'
import api from '@/utils/api'

export type Me = { id: number; name: string; email: string }

export const useAuth = defineStore('auth', {
    state: () => ({
        token: null as string | null,
        user: null as Me | null,
        roles: [] as string[],
        abilities: [] as string[],
        loading: false,
    }),
    getters: {
        isAuthed: (s) => !!s.token,
        can: (s) => (perm: string) => s.abilities.includes(perm) || s.roles.includes('super-admin'),
    },
    actions: {
        // /login returns: { ok, message, data: { token, user, roles, abilities, ... } }
        async login(email: string, password: string) {
            this.loading = true
            try {
                const res = await api.post('/login', { email, password, replace: true })
                const payload = res.data?.data ?? {} // <- NOTE: reading from data.data
                this.token = payload.token as string
                this.user = payload.user as Me
                this.roles = (payload.roles as string[]) ?? []
                this.abilities = (payload.abilities as string[]) ?? []

                if (this.token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
                }
            } finally {
                this.loading = false
            }
        },

        // /me returns: { ok, message, data: { id, name, email, roles[], abilities[] } }
        async loadMe() {
            if (!this.token) return
            const res = await api.get('/account/me')
            const payload = res.data?.data ?? {}
            this.user = { id: payload.id, name: payload.name, email: payload.email }
            this.roles = payload.roles ?? []
            this.abilities = payload.abilities ?? []
            api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        },

        async logout() {
            try { await api.post('/logout') } catch {}
            this.$reset()
            delete api.defaults.headers.common['Authorization']
            const { default: router } = await import('@/router')
            if (router.currentRoute.value.path !== '/login') await router.replace('/login')
        },

        async logoutAll() {
            try { await api.post('/logout-all') } catch {}
            this.$reset()
            delete api.defaults.headers.common['Authorization']
            const { default: router } = await import('@/router')
            if (router.currentRoute.value.path !== '/login') await router.replace('/login')
        },
    },
    persist: {
        key: 'erp-auth',
        paths: ['token', 'user', 'roles', 'abilities'],
        afterRestore(ctx) {
            const s = ctx.store as any
            if (!s.user || typeof s.user !== 'object' || Object.keys(s.user).length === 0 || s.user.id == null) {
                s.user = null
            }
            if (s.token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${s.token}`
            }
        },
    },
})
