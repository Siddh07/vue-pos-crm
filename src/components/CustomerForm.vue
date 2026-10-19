<script setup lang="ts">
import { reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email, helpers, minValue } from "@vuelidate/validators";
import type { CustomerInput } from '@/types/customer';

const props = defineProps<{ customer?: CustomerInput | null }>();
const emit = defineEmits<{ save: [customer: CustomerInput]; cancel: [] }>();

const form = reactive<CustomerInput>({
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "Active",
  dealValue: 0,
  ...props.customer,
});

const rules = {
  name: {
    required: helpers.withMessage("Name is required.", required),
  },
  email: {
    required: helpers.withMessage("Email is required.", required),
    email: helpers.withMessage("Enter a valid email address.", email),
  },
  phone: {
    required: helpers.withMessage("Phone is required.", required),
    phoneFormat: helpers.withMessage(
      "Enter exactly 10 digits.",
      helpers.regex(/^\d{10}$/),
    ),
  },
  dealValue: {
    required: helpers.withMessage("Deal value is required.", required),
    minValue: helpers.withMessage("Deal value must be zero or greater.", minValue(0)),
    finite: helpers.withMessage("Enter a valid deal value.", (value: unknown) => typeof value === 'number' && Number.isFinite(value)),
  },
};

const v$ = useVuelidate(rules, form);

async function submitForm() {
  const isValid = await v$.value.$validate();

  if (!isValid) return;

  emit('save', { ...form, name: form.name.trim(), email: form.email.trim(), company: form.company.trim() });
}
</script>

<template>
    <form
      @submit.prevent="submitForm"
      novalidate
      class="space-y-4"
    >
      <!-- Name -->
      <div>
        <label for="customer-name" class="block text-sm font-medium mb-2">
          Name
        </label>

        <input
          id="customer-name"
          v-model.trim="form.name"
          @blur="v$.name.$touch()"
          type="text"
          autocomplete="name"
          autofocus
          required
          :aria-invalid="v$.name.$error"
          aria-describedby="name-errors"
          :class="{ 'border-red-500': v$.name.$error }"
          class="w-full rounded-lg border bg-white dark:bg-gray-800 p-3"
        />

        <div id="name-errors" aria-live="polite">
          <p
            v-for="error in v$.name.$errors"
            :key="error.$uid"
            class="mt-1 text-sm text-red-600"
          >
            {{ error.$message }}
          </p>
        </div>
      </div>

      <!-- Email -->
      <div>
        <label for="customer-email" class="block text-sm font-medium mb-2">
          Email
        </label>

        <input
          id="customer-email"
          v-model.trim="form.email"
          @blur="v$.email.$touch()"
          type="email"
          autocomplete="email"
          required
          :aria-invalid="v$.email.$error"
          aria-describedby="email-errors"
          :class="{ 'border-red-500': v$.email.$error }"
          class="w-full rounded-lg border bg-white dark:bg-gray-800 p-3"
        />

        <div id="email-errors" aria-live="polite">
          <p
            v-for="error in v$.email.$errors"
            :key="error.$uid"
            class="mt-1 text-sm text-red-600"
          >
            {{ error.$message }}
          </p>
        </div>
      </div>

      <!-- Phone: practice rule requires exactly 10 digits -->
      <div>
        <label for="customer-phone" class="block text-sm font-medium mb-2">
          Phone
        </label>

        <input
          id="customer-phone"
          v-model="form.phone"
          @blur="v$.phone.$touch()"
          type="tel"
          autocomplete="tel"
          required
          :aria-invalid="v$.phone.$error"
          aria-describedby="phone-errors"
          :class="{ 'border-red-500': v$.phone.$error }"
          class="w-full rounded-lg border bg-white dark:bg-gray-800 p-3"
        />

        <div id="phone-errors" aria-live="polite">
          <p
            v-for="error in v$.phone.$errors"
            :key="error.$uid"
            class="mt-1 text-sm text-red-600"
          >
            {{ error.$message }}
          </p>
        </div>
      </div>

      <div>
        <label for="customer-company" class="mb-2 block text-sm font-medium">Company</label>
        <input id="customer-company" v-model="form.company" type="text" autocomplete="organization"
          class="w-full rounded-lg border bg-white p-3 dark:bg-gray-800" />
      </div>

      <div>
        <label for="customer-form-status" class="mb-2 block text-sm font-medium">Status</label>
        <select id="customer-form-status" v-model="form.status"
          class="w-full rounded-lg border bg-white p-3 dark:bg-gray-800">
          <option>Active</option>
          <option>Pending</option>
          <option>Closed</option>
        </select>
      </div>

      <div>
        <label for="customer-deal-value" class="mb-2 block text-sm font-medium">Deal value</label>
        <input id="customer-deal-value" v-model.number="form.dealValue" type="number" min="0" step="0.01"
          required @blur="v$.dealValue.$touch()" :aria-invalid="v$.dealValue.$error"
          aria-describedby="deal-value-errors" :class="{ 'border-red-500': v$.dealValue.$error }"
          class="w-full rounded-lg border bg-white p-3 dark:bg-gray-800" />
        <div id="deal-value-errors" aria-live="polite">
          <p v-for="error in v$.dealValue.$errors" :key="error.$uid" class="mt-1 text-sm text-red-600">{{ error.$message }}</p>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
      <button type="button" @click="emit('cancel')"
        class="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
        Cancel
      </button>
      <button
        type="submit"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        {{ customer ? 'Save changes' : 'Add customer' }}
      </button>
      </div>
    </form>
</template>
