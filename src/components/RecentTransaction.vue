<script setup lang="ts">
import DataTable from './common/DataTable.vue'
import SkeletonTable from './common/SkeletonTable.vue'

export interface Transaction {
    id: number | string
    customer: string
    amount: number
    status: 'Paid' | 'Pending' | 'Failed' | string
    date?: string
}

const props = withDefaults(
    defineProps<{
        isLoading?: boolean
        transactions?: Transaction[]
    }>(),
    {
        isLoading: false,
        transactions: () => [
            {
                id: 1,
                customer: 'John Doe',
                amount: 500,
                status: 'Paid',
                date: 'Today, 2:30 PM'
            },
            {
                id: 2,
                customer: 'Sarah Smith',
                amount: 250,
                status: 'Pending',
                date: 'Today, 1:15 PM'
            },
            {
                id: 3,
                customer: 'Mike Lee',
                amount: 800,
                status: 'Failed',
                date: 'Yesterday'
            }
        ]
    }
)
</script>

<template>
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition">
        <div class="flex items-center justify-between mb-4">
            <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Transactions
                </h2>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Latest sales activity and status
                </p>
            </div>
            <span v-if="!isLoading && transactions.length > 0" class="text-xs font-medium text-gray-500 dark:text-gray-400">
                {{ transactions.length }} orders
            </span>
        </div>

        <!-- 1. Skeleton Loading State -->
        <SkeletonTable v-if="isLoading" :rows="3" :columns="3" />

        <!-- 2. Empty Fallback State -->
        <div v-else-if="!transactions || transactions.length === 0"
            class="py-12 px-4 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">No transactions recorded</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                Completed POS sales and customer orders will appear here automatically.
            </p>
        </div>

        <!-- 3. Transactions Table -->
        <div v-else class="overflow-x-auto">
            <DataTable>
                <template #header>
                    <tr class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <th class="p-4 text-left">Customer</th>
                        <th class="p-4 text-left">Amount</th>
                        <th class="p-4 text-left">Status</th>
                    </tr>
                </template>

                <template #body>
                    <tr v-for="transaction in transactions" :key="transaction.id"
                        class="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors">
                        <td class="p-4">
                            <span class="font-medium text-gray-900 dark:text-white block">{{ transaction.customer }}</span>
                            <span v-if="transaction.date" class="text-xs text-gray-400 block">{{ transaction.date }}</span>
                        </td>

                        <td class="p-4 font-semibold text-gray-900 dark:text-white">
                            ${{ transaction.amount.toFixed(2) }}
                        </td>

                        <td class="p-4">
                            <span :class="[
                                'px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1',
                                transaction.status === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                                    : transaction.status === 'Pending'
                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                            ]">
                                <span class="w-1.5 h-1.5 rounded-full"
                                    :class="transaction.status === 'Paid' ? 'bg-emerald-500' : transaction.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'">
                                </span>
                                {{ transaction.status }}
                            </span>
                        </td>
                    </tr>
                </template>
            </DataTable>
        </div>
    </div>
</template>
