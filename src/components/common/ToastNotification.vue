<script setup lang="ts">
defineProps<{
    message: string
    type: 'success' | 'error' | 'warning'
    isVisible: boolean
}>()
</script>

<template>
    <div v-if="isVisible"
        :class="type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-amber-600'"
        class="fixed bottom-5 right-5 z-50 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 transition duration-200"
        role="alert">
        <span>{{ message }}</span>
    </div>
</template>