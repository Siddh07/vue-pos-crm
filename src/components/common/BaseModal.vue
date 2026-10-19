<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps<{ title: string }>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
let previousFocus: HTMLElement | null = null

onMounted(() => {
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  dialog.value?.showModal()
})

onBeforeUnmount(() => {
  dialog.value?.close()
  previousFocus?.focus()
})
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" aria-labelledby="modal-title" @cancel.prevent="emit('close')"
      class="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/50 dark:bg-gray-800 dark:text-gray-100">
      <div class="mb-6 flex items-center justify-between gap-4">
        <h2 id="modal-title" class="text-xl font-semibold">{{ title }}</h2>
        <button type="button" aria-label="Close dialog" @click="emit('close')"
          class="rounded-lg px-3 py-1 text-2xl hover:bg-gray-100 dark:hover:bg-gray-700">&times;</button>
      </div>
      <slot />
    </dialog>
  </Teleport>
</template>
