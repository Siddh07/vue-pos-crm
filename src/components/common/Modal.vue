<script setup lang="ts">
defineProps<{
    isOpen: boolean
}>()
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div class="bg-white rounded-xl p-6 shadow-xl">
                <slot></slot>
            </div>
        </div>
    </Teleport>
</template>