import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import {useAuth} from '@/stores/auth'

const routes: RouteRecordRaw[] = [
    {path: '/login', component: () => import('@/views/Login.vue'), meta: {auth: false}},
    {path: '/', component: () => import('@/views/Dashboard.vue'), meta: {auth: true}},
    {path: '/roles', component: () => import('@/views/Roles.vue'), meta: {auth: true, can: 'roles.view'}},
    {path: '/403', component: () => import('@/views/Forbidden.vue'), meta: {auth: false}},
    {path: '/pages', component: () => import('@/views/PagesAdmin.vue'), meta: {auth: true, can: 'pages.manage'}},
    {path: '/users', component: () => import('@/views/Users.vue'), meta: {auth: true, can: 'users.manage'}},
    {path: '/buildings', component: () => import('@/views/buildings/Buildings.vue'), meta: {auth: true, can: 'buildings.manage'}},
    {path: '/apartments', component: () => import('@/views/apartments/Apartments.vue'), meta: {auth: true, can: 'apartments.manage'}},
    {path: '/houses', component: () => import('@/views/houses/Houses.vue'), meta: {auth: true, can: 'houses.manage'}},
    {path: '/requests', component: () => import('@/views/requests/Requests.vue'), meta: {auth: true, can: 'requests.manage'}},
    {path: '/sales', component: () => import('@/views/sales/Sale.vue'), meta: {auth: true, can: 'sales.manage'}},
    {path: '/call-center', component: () => import('@/views/calls/CallCenter.vue'), meta: {auth: true, can: 'calls.manage'}},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to) => {
    const auth = useAuth()

    // try to hydrate on first nav if token exists
    if (auth.token && !auth.user && to.path !== '/login') {
        try {
            await auth.loadMe()
        } catch {
        }
    }

    // needs auth?
    if (to.meta?.auth && !auth.isAuthed) {
        return {path: '/login', query: {next: to.fullPath}}
    }

    // needs permission?
    const need = to.meta?.can as string | undefined
    if (need && !auth.can(need)) {
        return {path: '/403'}
    }
    if (need && !(auth.abilities.includes(need) || auth.roles.includes('super-admin'))) {
        return {path: '/'}
    }

    // if authed, block going back to login
    if (to.path === '/login' && auth.isAuthed) return {path: '/'}

    return true
})

export default router