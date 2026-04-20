import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import SeriesDetail from '@/views/SeriesDetail.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import Contact from '@/views/Contact.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/series/:series', component: SeriesDetail },
    { path: '/product/:id', component: ProductDetail },
    { path: '/contact', component: Contact }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router