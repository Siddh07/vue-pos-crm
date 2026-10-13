<script setup>
defineProps({
    title: { type: String, required: true },
    value: { type: [Number, String], required: true },
    color: { type: String, default: 'bg-blue-600' },
    icon: { type: String, default: 'mdi-chart-line' }
})

</script>
<template>
    <div class="">
        <p>{{ title }}</p>
        <p></p>
    </div>
</template>