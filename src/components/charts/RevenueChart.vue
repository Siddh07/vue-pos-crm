<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const props = withDefaults(
    defineProps<{
        labels?: string[]
        data?: number[]
        isLoading?: boolean
    }>(),
    {
        labels: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: () => [12500, 18200, 24100, 21900, 29400, 32100, 38400, 36200, 42100, 45280, 41000, 48900],
        isLoading: false
    }
)

const hasData = computed(() => props.data && props.data.length > 0)

const chartData = computed(() => ({
    labels: props.labels,
    datasets: [
        {
            label: 'Monthly Revenue ($)',
            data: props.data,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
        }
    ]
}))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            callbacks: {
                label: (context: any) => `Revenue: $${context.parsed.y.toLocaleString()}`
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                callback: (val: any) => `$${val.toLocaleString()}`
            },
            grid: {
                color: 'rgba(229, 231, 235, 0.5)'
            }
        },
        x: {
            grid: {
                display: false
            }
        }
    }
}
</script>

<template>
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition">
        <div class="flex items-center justify-between mb-4">
            <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Monthly Revenue Trend
                </h2>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Performance overview for the calendar year
                </p>
            </div>
            <span class="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-md">
                +14.2% YoY
            </span>
        </div>

        <!-- Skeleton Loading State -->
        <div v-if="isLoading" class="h-72 flex flex-col justify-between animate-pulse pt-4">
            <div class="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
            <div class="flex justify-between items-center px-2 pt-2">
                <div v-for="n in 8" :key="n" class="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        </div>

        <!-- Empty Fallback State -->
        <div v-else-if="!hasData" class="h-72 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 mb-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
            </div>
            <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">No revenue data available</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                Revenue metrics will populate automatically when transactions are recorded.
            </p>
        </div>

        <!-- Chart -->
        <div v-else class="h-72">
            <Line :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>
