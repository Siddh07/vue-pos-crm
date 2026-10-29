<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
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

// Pagination State
const currentPage = ref(1)
const pageSize = 10

// Fetch customers from API on mount
onMounted(() => {
  customerStore.fetchCustomers()
})

// Filtered and Sorted list derived from store state
const filteredCustomers = computed(() => {
  const list = Array.isArray(customers.value) ? customers.value : []
  const query = searchQuery.value.trim().toLowerCase()

  return list
    .filter((customer) => {
      const name = customer.name?.toLowerCase() || ''
      const company = customer.company?.toLowerCase() || ''
      const email = customer.email?.toLowerCase() || ''

      const matchesSearch =
        !query ||
        name.includes(query) ||
        company.includes(query) ||
        email.includes(query)

      const matchesStatus =
        statusFilter.value === 'All' || customer.status === statusFilter.value

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy.value === 'name') {
        comparison = (a.name || '').localeCompare(b.name || '')
      } else if (sortBy.value === 'dealValue') {
        comparison = (Number(a.dealValue) || 0) - (Number(b.dealValue) || 0)
      }

      // Tie-breaker using safe string collation
      if (comparison === 0) {
        comparison = String(a.id || '').localeCompare(String(b.id || ''), undefined, { numeric: true })
      }

      return sortOrder.value === 'asc' ? comparison : -comparison
    })
})

// Computed Pagination Slices
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredCustomers.value.length / pageSize))
)

const pageStart = computed(() => (currentPage.value - 1) * pageSize)

const paginatedCustomers = computed(() =>
  filteredCustomers.value.slice(pageStart.value, pageStart.value + pageSize)
)

// Reset to page 1 on search / filter / sort change
watch([searchQuery, statusFilter, sortBy, sortOrder], () => {
  currentPage.value = 1
})

// Prevent page from getting stuck out of bounds
watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
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
  const result = selectedCustomer.value
    ? await customerStore.updateCustomer(selectedCustomer.value.id, input)
    : await customerStore.addCustomer(input)

  if (result) {
    closeModal()
  }
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
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manage your CRM accounts and deals</p>
      </div>
      <button
        @click="openCreateModal"
        class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
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
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-blue-500"
        />
      </div>
      <div class="sm:w-44">
        <label for="customer-status" class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>
        <select
          id="customer-status"
          v-model="statusFilter"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-blue-500"
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
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-blue-500"
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
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-blue-500"
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

    <!-- Customers Table & Pagination (Show when not loading) -->
    <div v-else class="space-y-4">
      <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
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
            <tr v-for="customer in paginatedCustomers" :key="customer.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/40">
              <td class="px-4 py-3 font-medium">
                <RouterLink
                  :to="{ name: 'customer-detail', params: { id: customer.id } }"
                  class="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {{ customer.name }}
                </RouterLink>
              </td>
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
              <td class="px-4 py-3 font-mono text-gray-900 dark:text-gray-100">
                ${{ (Number(customer.dealValue) || 0).toLocaleString() }}
              </td>
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

      <!-- Pagination Controls -->
      <nav
        aria-label="Customer list pagination"
        class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-sm text-gray-700 dark:text-gray-300"
      >
        <div>
          Showing
          <span class="font-medium text-gray-900 dark:text-gray-100">
            {{ filteredCustomers.length ? pageStart + 1 : 0 }}
          </span>
          to
          <span class="font-medium text-gray-900 dark:text-gray-100">
            {{ Math.min(pageStart + pageSize, filteredCustomers.length) }}
          </span>
          of
          <span class="font-medium text-gray-900 dark:text-gray-100">
            {{ filteredCustomers.length }}
          </span>
          customers
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span class="px-2 text-sm text-gray-700 dark:text-gray-300">
            Page {{ currentPage }} of {{ totalPages }}
          </span>

          <button
            type="button"
            :disabled="currentPage === totalPages || filteredCustomers.length === 0"
            @click="currentPage++"
            class="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </nav>
    </div>

    <!-- Customer Form Modal -->
    <CustomerForm
      v-if="isModalOpen"
      :customer="selectedCustomer"
      :loading="loading"
      @submit="handleFormSubmit"
      @close="closeModal"
    />
  </div>
</template>
