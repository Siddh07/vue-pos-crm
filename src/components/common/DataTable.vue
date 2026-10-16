<template>
    <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <table class="w-full text-left border-collapse min-w-[320px]">
            <thead class="bg-gray-50 dark:bg-gray-700/60 border-b border-gray-200 dark:border-gray-700">
                <slot name="header"></slot>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-700/60">
                <slot name="body"></slot>
            </tbody>
        </table>
    </div>
</template>
