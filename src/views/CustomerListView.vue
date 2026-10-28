<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCustomerStore } from '@/stores/useCustomerStore'
import type { Customer, CustomerInput } from '@/types/customer'
import CustomerForm from '@/components/CustomerForm.vue'

const customerStore = useCustomerStore()
const { customers, loading, error } = storeToRefs(customerStore)

// Modal & Selection State
const isModalOpen = ref(false)
const selectedCustomer = ref<Customer | null>(null)

// Filtering & Search State
const searchQuery = ref('')
const statusFilter = ref<'All' | 'Active' | 'Pending' | 'Closed'>('All')
const sortBy = ref<'name' | 'dealValue'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Fetch customers from API on mount
onMounted(() => {
  customerStore.fetchCustomers()
})

// Filtered and Sorted list derived from store state
const filteredCustomers = computed(() => {
  return customers.value
    .filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.value.toLowerCase())

      const matchesStatus =
        statusFilter.value === 'All' || customer.status === statusFilter.value

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy.value === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy.value === 'dealValue') {
        comparison = (a.dealValue || 0) - (b.dealValue || 0)
      }

      // Tie-breaker using string comparison instead of subtraction
      if (comparison === 0) {
        comparison = a.id.localeCompare(b.id)
      }

      return sortOrder.value === 'asc' ? comparison : -comparison
    })
})

// Modal Openers
function openCreateModal() {
  selectedCustomer.value = null
  isModalOpen.value = true
}

function openEditModal(customer: Customer) {
  selectedCustomer.value = customer
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedCustomer.value = null
}

// Store Action Dispatches
async function handleFormSubmit(input: CustomerInput) {
  if (selectedCustomer.value) {
    await customerStore.updateCustomer(selectedCustomer.value.id, input)
  } else {
    await customerStore.addCustomer(input)
  }
  closeModal()
}

async function handleDelete(id: string) {
  const confirmed = window.confirm('Are you sure you want to delete this customer?')
  if (confirmed) {
    await customerStore.removeCustomer(id)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Actions -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Customers</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manage your CRM accounts and deals</p>
      </div>
      <button
        @click="openCreateModal"
        class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        + Add Customer
      </button>
    </div>

    <!-- Error Alert -->
    <div
      v-if="error"
      class="rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700 flex justify-between items-center dark:bg-red-950/40 dark:border-red-900 dark:text-red-300"
    >
      <span>{{ error }}</span>
      <button
        @click="customerStore.fetchCustomers"
        class="underline font-medium hover:text-red-900 dark:hover:text-red-100"
      >
        Retry
      </button>
    </div>

    <!-- Controls (Search, Filters, Sorting) -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label for="customer-search" class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Search customers</label>
        <input
          id="customer-search"
          v-model="searchQuery"
          type="search"
          placeholder="Search name, email, or company"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 text-sm focus:outline-blue-500"
        />
      </div>
      <div class="sm:w-44">
        <label for="customer-status" class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>
        <select
          id="customer-status"
          v-model="statusFilter"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 text-sm focus:outline-blue-500"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      <div class="sm:w-44">
        <label for="customer-sort-by" class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Sort By</label>
        <select
          id="customer-sort-by"
          v-model="sortBy"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 text-sm focus:outline-blue-500"
        >
          <option value="name">Name</option>
          <option value="dealValue">Deal Value</option>
        </select>
      </div>
      <div class="sm:w-36">
        <label for="customer-sort-order" class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Order</label>
        <select
          id="customer-sort-order"
          v-model="sortOrder"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 text-sm focus:outline-blue-500"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-12 flex justify-center items-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-sm text-gray-600 dark:text-gray-400">Loading customers...</span>
    </div>

    <!-- Customers Table (Show when not loading) -->
    <div v-else class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead class="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th scope="col" class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Name</th>
            <th scope="col" class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Email</th>
            <th scope="col" class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Phone</th>
            <th scope="col" class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Company</th>
            <th scope="col" class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Status</th>
            <th scope="col" class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Deal Value</th>
            <th scope="col" class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <tr v-for="customer in filteredCustomers" :key="customer.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/40">
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{{ customer.name }}</td>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ customer.email }}</td>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ customer.phone }}</td>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ customer.company }}</td>
            <td class="px-4 py-3">
              <span
                :class="{
                  'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300': customer.status === 'Active',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300': customer.status === 'Pending',
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': customer.status === 'Closed',
                }"
                class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              >
                {{ customer.status }}
              </span>
            </td>
            <td class="px-4 py-3 font-mono text-gray-900 dark:text-gray-100">${{ customer.dealValue.toLocaleString() }}</td>
            <td class="px-4 py-3 text-right space-x-2">
              <button
                @click="openEditModal(customer)"
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Edit
              </button>
              <button
                @click="handleDelete(customer.id)"
                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
              >
                Delete
              </button>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="filteredCustomers.length === 0">
            <td colspan="7" class="py-8 text-center text-gray-500 dark:text-gray-400">
              No customers found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Customer Form Modal -->
    <CustomerForm
      v-if="isModalOpen"
      :customer="selectedCustomer"
      @submit="handleFormSubmit"
      @close="closeModal"
    />
  </div>
</template>
