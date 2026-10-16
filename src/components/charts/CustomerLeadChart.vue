<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)

// Example customer lead data
const chartData = {
    labels: [
        'Website',
        'Social Media',
        'Referrals',
        'Other'
    ],

    datasets: [
        {
            label: 'Customer Leads',
            data: [450, 300, 150, 100],

            backgroundColor: [
                '#2563eb',
                '#16a34a',
                '#f59e0b',
                '#9333ea'
            ],

            borderWidth: 0
        }
    ]
}




const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%'
}
</script>

<template>
    <div class="bg-white rounded-xl p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">
            Customer Lead Breakdown
        </h2>

        <div class="h-72">
            <Doughnut :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>
