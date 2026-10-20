import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import PosView from '@/views/PosView.vue';
import CrmView from '@/views/CrmView.vue';
import CustomerDetailView from '@/views/CustomerDetailView.vue';

const routes = [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/dashboard', redirect: '/' },
    { path: '/pos', name: 'pos', component: PosView },
    { path: '/crm', name: 'crm', component: CrmView },
    { path: '/crm/customers/:id', name: 'customer-detail', component: CustomerDetailView }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
