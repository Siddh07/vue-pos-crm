<template>
    <div class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse flex items-center justify-between"
        role="status" aria-label="Loading metric card">
        <div class="flex-1 min-w-0 pr-4">
            <!-- Title skeleton -->
            <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>

            <!-- Value skeleton -->
            <div class="h-8 w-36 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>

            <!-- Trend/subtitle skeleton -->
            <div class="flex items-center gap-2">
                <div class="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div class="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        </div>

        <!-- Icon box skeleton -->
        <div class="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0"></div>

        <span class="sr-only">Loading metric data...</span>
    </div>
</template>
