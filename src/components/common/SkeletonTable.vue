<script setup lang="ts">
withDefaults(
    defineProps<{
        rows?: number
        columns?: number
        showHeader?: boolean
    }>(),
    {
        rows: 5,
        columns: 3,
        showHeader: true
    }
)

const columnWidths = ['w-3/4', 'w-1/2', 'w-2/3', 'w-1/3', 'w-4/5']
</script>

<template>
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden animate-pulse"
        role="status" aria-label="Loading table data">
        <!-- Optional Table Header Skeleton -->
        <div v-if="showHeader"
            class="grid gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold"
            :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }">
            <div v-for="c in columns" :key="'header-' + c" class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>

        <!-- Table Rows Skeleton -->
        <div class="divide-y divide-gray-100 dark:divide-gray-700/50">
            <div v-for="r in rows" :key="'row-' + r" class="grid gap-4 p-4 items-center"
                :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }">
                <div v-for="c in columns" :key="'col-' + c"
                    class="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                    :class="[columnWidths[(r + c) % columnWidths.length]]">
                </div>
            </div>
        </div>

        <span class="sr-only">Loading table data...</span>
    </div>
</template>
