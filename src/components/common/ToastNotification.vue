<script setup lang="ts">
defineProps<{
    message: string
    type: 'success' | 'error' | 'warning'
    isVisible: boolean
}>()
</script>

<template>
    <div v-if="isVisible"
        :class="type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-yellow-600'"
        class="text-white p-4 rounded-xl shadow-xl">
        {{ message }}
    </div>
</template>