<script setup lang="ts">
import { reactive } from 'vue'

// Vue tracks changes to these properties and updates the template.
const form = reactive({
  name: '',
  email: '',
  phone: ''
})
</script>

<template>
  <section class="rounded-lg border border-gray-300 dark:border-gray-600 p-6 space-y-4">
    <h2 class="text-xl font-semibold">Customer form practice</h2>

    <!-- Prevent Enter from submitting the form and refreshing the page. -->
    <form @submit.prevent class="space-y-4">
      <div>
        <label for="customer-name" class="block text-sm font-medium mb-2">Name</label>
        <!-- v-model connects this input to form.name in both directions. -->
        <input id="customer-name" v-model="form.name" type="text" autocomplete="name"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3" />
      </div>

      <div>
        <label for="customer-email" class="block text-sm font-medium mb-2">Email</label>
        <input id="customer-email" v-model="form.email" type="email" autocomplete="email"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3" />
      </div>

      <div>
        <label for="customer-phone" class="block text-sm font-medium mb-2">Phone</label>
        <input id="customer-phone" v-model="form.phone" type="tel" autocomplete="tel"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3" />
      </div>
    </form>

    <div>
      <h3 class="text-sm font-medium mb-2">Live form data (temporary learning preview)</h3>
      <pre class="overflow-x-auto rounded-lg bg-gray-100 dark:bg-gray-900 p-4 text-sm">{{ JSON.stringify(form, null, 2) }}</pre>
    </div>
  </section>
</template>
