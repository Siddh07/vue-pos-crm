<script setup lang="ts">
import { computed, ref } from 'vue'

const search = ref('')

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
        [customer.name, customer.email, customer.company].some(value =>
            value.toLowerCase().includes(query)
        )
    )
})
</script>

<template>
    <input v-model="search" type="search" placeholder="Search name, email, or company"
        class="w-full rounded-lg border p-3" />

    <ul>
        <li v-for="customer in filteredCustomers" :key="customer.id" class="border-b p-3">
            {{ customer.name }} — {{ customer.email }} — {{ customer.company }}
        </li>
    </ul>

    <p v-if="filteredCustomers.length === 0">
        No matching customers.
    </p>
</template>