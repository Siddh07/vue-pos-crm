<script setup lang="ts">
// Import our reusable components
import StatCard from '@/components/common/StatCard.vue'
import RevenueChart from '@/components/charts/RevenueChart.vue'


import { ref } from 'vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'

const isLoading = ref(true)
</script>

<template>
    <div class="p-6 space-y-6 bg-gray-50 min-h-screen">

        <!-- 1. Dashboard Heading -->
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                Executive Dashboard
            </h1>

            <p class="text-gray-500 mt-1">
                Overview of your business performance
            </p>
        </div>

        <!-- 2. KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

            <template v-if="isLoading">
                <SkeletonCard v-for="n in 3" :key="n" />
            </template>

            <template v-else>
                <StatCard title="Total Revenue" value="$45,280" />
                <StatCard title="Total Orders" :value="1248" />
                <StatCard title="Total Customers" :value="856" />
            </template>

        </div>

        <!-- 3. Monthly Revenue Chart -->
        <div class="grid grid-cols-1 gap-6">
            <RevenueChart />
        </div>

    </div>
</template>
