<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DataTable from '@/components/common/DataTable.vue'

const search = ref('')
const status = ref('All')
const statuses = ['All', 'Active', 'Pending', 'Closed']
type SortKey = 'name' | 'email' | 'company' | 'dealValue'
const sortKey = ref<SortKey>('name')
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const pageSize = 10

const customers = ref([
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme',
        status: 'Active',
        dealValue: 500
    },
    {
        id: 2,
        name: 'Sarah Smith',
        email: 'sarah@example.com',
        company: 'Bright Labs',
        status: 'Pending',
        dealValue: 900
    }
])

const filteredCustomers = computed(() => {
    const query = search.value.trim().toLowerCase()

    return customers.value.filter(customer =>
        (status.value === 'All' || customer.status === status.value) &&
        [customer.name, customer.email, customer.company].some(value =>
            value.toLowerCase().includes(query)
        )
    )
})

const sortedCustomers = computed(() => [...filteredCustomers.value].sort((a, b) => {
    const key = sortKey.value
    const comparison = key === 'dealValue'
        ? a.dealValue - b.dealValue
        : a[key].localeCompare(b[key], undefined, { sensitivity: 'base' })
    return (sortDirection.value === 'asc' ? comparison : -comparison) || a.id - b.id
}))
const totalPages = computed(() => Math.max(1, Math.ceil(sortedCustomers.value.length / pageSize)))
const pageStart = computed(() => (currentPage.value - 1) * pageSize)
const paginatedCustomers = computed(() => sortedCustomers.value.slice(pageStart.value, pageStart.value + pageSize))

watch([search, status, sortKey, sortDirection], () => { currentPage.value = 1 }, { flush: 'sync' })
watch(totalPages, pages => { currentPage.value = Math.min(currentPage.value, pages) }, { flush: 'sync' })

function sortBy(key: SortKey) {
    if (sortKey.value === key) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortKey.value = key
        sortDirection.value = key === 'dealValue' ? 'desc' : 'asc'
    }
}

function ariaSort(key: SortKey) {
    return sortKey.value === key ? (sortDirection.value === 'asc' ? 'ascending' : 'descending') : 'none'
}

function sortIndicator(key: SortKey) {
    return sortKey.value === key ? (sortDirection.value === 'asc' ? '↑' : '↓') : '↕'
}

const textColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'company', label: 'Company' }
] as const
</script>

<template>
    <section class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <h1 class="text-2xl font-bold">Customers</h1>

        <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
                <label for="customer-search" class="block text-sm font-medium mb-2">Search customers</label>
                <input id="customer-search" v-model="search" type="search"
                    placeholder="Search name, email, or company"
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 focus:outline-blue-500" />
            </div>
            <div class="sm:w-48">
                <label for="customer-status" class="block text-sm font-medium mb-2">Status</label>
                <select id="customer-status" v-model="status"
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 focus:outline-blue-500">
                    <option v-for="option in statuses" :key="option" :value="option">{{ option }}</option>
                </select>
            </div>
        </div>

        <DataTable>
            <template #header>
                <tr>
                    <th v-for="column in textColumns" :key="column.key" scope="col"
                        :aria-sort="ariaSort(column.key)" class="p-4">
                        <button type="button" class="cursor-pointer flex items-center gap-2 hover:text-blue-500"
                            @click="sortBy(column.key)">
                            {{ column.label }} <span aria-hidden="true">{{ sortIndicator(column.key) }}</span>
                        </button>
                    </th>
                    <th scope="col" class="p-4">Status</th>
                    <th scope="col" :aria-sort="ariaSort('dealValue')" class="p-4 text-right">
                        <button type="button" class="cursor-pointer inline-flex items-center gap-2 hover:text-blue-500"
                            @click="sortBy('dealValue')">
                            Deal Value <span aria-hidden="true">{{ sortIndicator('dealValue') }}</span>
                        </button>
                    </th>
                </tr>
            </template>
            <template #body>
                <tr v-for="customer in paginatedCustomers" :key="customer.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                    <td class="p-4 font-medium">{{ customer.name }}</td>
                    <td class="p-4">{{ customer.email }}</td>
                    <td class="p-4">{{ customer.company }}</td>
                    <td class="p-4">{{ customer.status }}</td>
                    <td class="p-4 text-right tabular-nums">{{ customer.dealValue.toLocaleString() }}</td>
                </tr>
                <tr v-if="filteredCustomers.length === 0">
                    <td colspan="5" class="p-8 text-center text-gray-500 dark:text-gray-400">
                        No matching customers.
                    </td>
                </tr>
            </template>
        </DataTable>

        <nav aria-label="Customer pagination" class="flex flex-wrap items-center justify-between gap-4 text-sm">
            <p role="status" class="text-gray-600 dark:text-gray-400">
                Showing {{ filteredCustomers.length ? pageStart + 1 : 0 }}?{{ pageStart + paginatedCustomers.length }}
                of {{ filteredCustomers.length }} customers
            </p>
            <div class="flex items-center gap-3">
                <button type="button" :disabled="currentPage === 1" @click="currentPage--"
                    class="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed">
                    Previous
                </button>
                <span>Page {{ currentPage }} of {{ totalPages }}</span>
                <button type="button" :disabled="currentPage === totalPages" @click="currentPage++"
                    class="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed">
                    Next
                </button>
            </div>
        </nav>
    </section>
</template>
