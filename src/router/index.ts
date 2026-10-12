import { createRouter, createWebHistory } from 'vue-router';
import PosView from '@/views/PosView.vue';
import CrmView from '@/views/CrmView.vue';

const routes = [
    { path: '/', name: 'pos', component: PosView },
    { path: '/crm', name: 'crm', component: CrmView }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
