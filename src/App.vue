<script setup lang="ts">
import { ref } from 'vue'

const isModalOpen = ref(false)
const showToast = ref(false)

function saveCustomer() {

  isModalOpen.value = false
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<template>
  <button @click="isModalOpen = true">
    Add Customer
  </button>

  <Modal :isOpen="isModalOpen">
    <form @submit.prevent="saveCustomer">
      <input placeholder="Customer name" />
      <button type="submit">Save</button>
    </form>
  </Modal>

  <ToastNotification message="Customer saved!" type="success" :isVisible="showToast" />
</template>