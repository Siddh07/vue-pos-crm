<!-- App.vue (Fixed) -->
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <!-- 1. Permanent Navigation Bar -->
  <nav class="flex gap-4 p-4 bg-gray-800 text-white">
    <RouterLink to="/">POS</RouterLink>
    <RouterLink to="/crm">CRM</RouterLink>
  </nav>

  <!-- 2. Dynamic Window: Vue Router injects PosView or CrmView HERE -->
  <main class="p-4">
    <RouterView />
  </main>
</template>