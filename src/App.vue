<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Modal from '@/components/common/Modal.vue'
import ToastNotification from '@/components/common/ToastNotification.vue'

const isModalOpen = ref(false)
const showToast = ref(false)
const customerName = ref('')

function saveCustomer() {
  if (!customerName.value.trim()) return
  isModalOpen.value = false
  showToast.value = true
  customerName.value = ''

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Responsive Navigation Bar -->
    <header class="bg-gray-900 text-white border-b border-gray-800 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4 sm:gap-8">
            <span class="font-bold text-base sm:text-lg text-blue-400 tracking-tight">Vue POS & CRM</span>
            <nav class="flex gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
              <RouterLink
                to="/"
                class="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md transition hover:bg-gray-800 text-gray-300 hover:text-white"
                active-class="bg-gray-800 text-white font-semibold"
              >
                Dashboard
              </RouterLink>
              <RouterLink
                to="/pos"
                class="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md transition text-gray-300 hover:text-white hover:bg-gray-800"
                active-class="bg-gray-800 text-white font-semibold"
              >
                POS
              </RouterLink>
              <RouterLink
                to="/crm"
                class="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md transition text-gray-300 hover:text-white hover:bg-gray-800"
                active-class="bg-gray-800 text-white font-semibold"
              >
                CRM
              </RouterLink>
            </nav>
          </div>

          <button
            @click="isModalOpen = true"
            class="text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition cursor-pointer"
          >
            + Add Customer
          </button>
        </div>
      </div>
    </header>

    <!-- Main View Area -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Modal & Toast Notification -->
    <Modal :isOpen="isModalOpen">
      <form @submit.prevent="saveCustomer" class="space-y-4 min-w-[280px] sm:min-w-[340px]">
        <h3 class="text-lg font-bold text-gray-900">Add New Customer</h3>
        <input
          v-model="customerName"
          placeholder="Customer name"
          required
          class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-blue-500 text-gray-900"
        />
        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            @click="isModalOpen = false"
            class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>

    <ToastNotification message="Customer saved successfully!" type="success" :isVisible="showToast" />
  </div>
</template>