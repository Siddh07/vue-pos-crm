<script setup lang="ts">
import { ref } from 'vue'
import StatCard from '@/components/common/StatCard.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import RevenueChart from '@/components/charts/RevenueChart.vue'
import RecentTransaction from '@/components/RecentTransaction.vue'
import type { Transaction } from '@/components/RecentTransaction.vue'

interface MetricItem {
    id: string
    title: string
    value: string | number
    subtitle?: string
    trend?: string
    trendUp?: boolean
    color?: string
    icon?: string
}

// Sample metrics
const defaultMetrics: MetricItem[] = [
    {
        id: 'revenue',
        title: 'Total Revenue',
        value: '$45,280',
        subtitle: 'vs. last month',
        trend: '+12.5%',
        trendUp: true,
        color: 'bg-blue-600',
        icon: 'mdi-currency-usd'
    },
    {
        id: 'orders',
        title: 'Total Orders',
        value: 1248,
        subtitle: 'vs. last month',
        trend: '+8.2%',
        trendUp: true,
        color: 'bg-emerald-600',
        icon: 'mdi-cart-outline'
    },
    {
        id: 'customers',
        title: 'Total Customers',
        value: 856,
        subtitle: 'vs. last month',
        trend: '-2.4%',
        trendUp: false,
        color: 'bg-purple-600',
        icon: 'mdi-account-group'
    }
]

// Sample transactions
const defaultTransactions: Transaction[] = [
    { id: 1, customer: 'John Doe', amount: 500, status: 'Paid', date: 'Today, 2:30 PM' },
    { id: 2, customer: 'Sarah Smith', amount: 250, status: 'Pending', date: 'Today, 1:15 PM' },
    { id: 3, customer: 'Mike Lee', amount: 800, status: 'Failed', date: 'Yesterday' },
    { id: 4, customer: 'Emma Watson', amount: 340, status: 'Paid', date: 'Yesterday' }
]

const defaultRevenueData = [12500, 18200, 24100, 21900, 29400, 32100, 38400, 36200, 42100, 45280, 41000, 48900]

// Interactive state controls for testing skeleton loading & empty states
const isLoading = ref(false)
const hasMetrics = ref(true)
const metrics = ref<MetricItem[]>([...defaultMetrics])
const transactions = ref<Transaction[]>([...defaultTransactions])
const revenueData = ref<number[]>([...defaultRevenueData])

function setMode(mode: 'loading' | 'empty' | 'normal') {
    if (mode === 'loading') {
        isLoading.value = true
        hasMetrics.value = true
    } else if (mode === 'empty') {
        isLoading.value = false
        hasMetrics.value = false
        metrics.value = []
        transactions.value = []
        revenueData.value = []
    } else {
        isLoading.value = false
        hasMetrics.value = true
        metrics.value = [...defaultMetrics]
        transactions.value = [...defaultTransactions]
        revenueData.value = [...defaultRevenueData]
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto space-y-6">

            <!-- 1. Dashboard Heading with Responsive State Controls -->
            <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Executive Dashboard
                    </h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Business metrics, real-time revenue analytics, and recent sales
                    </p>
                </div>

                <!-- Quick UI State Testing Controls (Mobile scrollable / Wrap) -->
                <div class="flex items-center gap-2 self-start sm:self-auto bg-white dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-xs">
                    <span class="text-gray-400 font-medium px-2 hidden md:inline">Test State:</span>
                    <button
                        @click="setMode('normal')"
                        :class="[!isLoading && hasMetrics ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700']"
                        class="px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer"
                        id="state-normal-btn"
                    >
                        Normal
                    </button>
                    <button
                        @click="setMode('loading')"
                        :class="[isLoading ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700']"
                        class="px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer"
                        id="state-loading-btn"
                    >
                        Skeleton Loading
                    </button>
                    <button
                        @click="setMode('empty')"
                        :class="[!isLoading && !hasMetrics ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700']"
                        class="px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer"
                        id="state-empty-btn"
                    >
                        Empty State
                    </button>
                </div>
            </header>

            <!-- 2. KPI Cards Section (Responsive Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop) -->
            <section aria-label="Key Performance Indicators">
                <!-- Skeleton Loading State for Cards -->
                <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <SkeletonCard v-for="n in 3" :key="'skeleton-card-' + n" />
                </div>

                <!-- Empty Fallback State When No Metrics Exist -->
                <div
                    v-else-if="!hasMetrics || metrics.length === 0"
                    class="bg-white dark:bg-gray-800 rounded-xl p-8 sm:p-12 border border-dashed border-gray-300 dark:border-gray-700 text-center shadow-xs"
                >
                    <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        No performance metrics available
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-md mx-auto">
                        There are currently no sales, order, or customer metrics recorded for this active reporting period.
                    </p>
                    <div class="mt-5 flex justify-center gap-3">
                        <button
                            @click="setMode('normal')"
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                        >
                            Load Sample Metrics
                        </button>
                    </div>
                </div>

                <!-- Populated Metric Stat Cards -->
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <StatCard
                        v-for="metric in metrics"
                        :key="metric.id"
                        :title="metric.title"
                        :value="metric.value"
                        :subtitle="metric.subtitle"
                        :trend="metric.trend"
                        :trendUp="metric.trendUp"
                        :color="metric.color"
                        :icon="metric.icon"
                    />
                </div>
            </section>

            <!-- 3. Visual Charts & Recent Transactions (Responsive 1-col on mobile/tablet, 2-col / 3-col split on desktop) -->
            <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Revenue Trend Chart (Spans 2 columns on large viewports) -->
                <div class="lg:col-span-2">
                    <RevenueChart :isLoading="isLoading" :data="revenueData" />
                </div>

                <!-- Recent Transactions (Spans 1 column on large viewports, full width on mobile/tablet) -->
                <div class="lg:col-span-1">
                    <RecentTransaction :isLoading="isLoading" :transactions="transactions" />
                </div>
            </section>

        </div>
    </div>
</template>
