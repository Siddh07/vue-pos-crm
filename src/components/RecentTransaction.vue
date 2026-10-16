<script setup lang="ts">
import DataTable from './common/DataTable.vue'

const transactions = [
    {
        id: 1,
        customer: 'John Doe',
        amount: 500,
        status: 'Paid'
    },
    {
        id: 2,
        customer: 'Sarah Smith',
        amount: 250,
        status: 'Pending'
    },
    {
        id: 3,
        customer: 'Mike Lee',
        amount: 800,
        status: 'Failed'
    }
]
</script>

<template>
    <div class="bg-white rounded-xl p-6 shadow-sm">

        <h2 class="text-lg font-semibold mb-4">
            Recent Transactions
        </h2>

        <DataTable>
            <template #header>
                <tr>
                    <th class="p-4">Customer</th>
                    <th class="p-4">Amount</th>
                    <th class="p-4">Status</th>
                </tr>
            </template>

            <template #body>
                <tr v-for="transaction in transactions" :key="transaction.id">
                    <td class="p-4">
                        {{ transaction.customer }}
                    </td>

                    <td class="p-4">
                        ${{ transaction.amount }}
                    </td>

                    <td class="p-4">
                        <span :class="[
                            'px-2 py-1 rounded-full text-xs font-semibold',

                            transaction.status === 'Paid'
                                ? 'bg-green-100 text-green-700'
                                : transaction.status === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                        ]">
                            {{ transaction.status }}
                        </span>
                    </td>
                </tr>
            </template>
        </DataTable>

        <p v-if="transactions.length === 0" class="text-center text-gray-500 py-6">
            No recent transactions available.
        </p>

    </div>
</template>
