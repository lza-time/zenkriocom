import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import SeriesDetail from '@/views/SeriesDetail.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import Contact from '@/views/Contact.vue'
import Admin from '@/views/Admin.vue'
import { getUser } from '@/services/authService.js'

const routes = [
    { path: '/', component: Home },
    { path: '/series/:series', component: SeriesDetail, meta: { requiresAuth: true } },
    { path: '/product/:id', component: ProductDetail, meta: { requiresAuth: true } },
    { path: '/login', redirect: '/?auth=login' },
    { path: '/register', redirect: '/?auth=register' },
    { path: '/contact', component: Contact, meta: { requiresAuth: true } },
    { path: '/admin', component: Admin, meta: { requiresAdmin: true } }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to) => {
    const user = getUser()
    if (to.meta.requiresAdmin && user?.role !== 'admin') {
        return { path: '/', query: { auth: 'login', redirect: to.fullPath } }
    }
    if (to.meta.requiresAuth && !user) {
        return { path: '/', query: { auth: 'login', redirect: to.fullPath } }
    }
    return true
})

export default router