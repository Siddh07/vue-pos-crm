<template>
    <div class="overflow-x-auto rounded-xl border border-gray-200">
        <table class="w-full text-left">
            <thead class="bg-gray-100">
                <slot name="header"></slot>
            </thead>

            <tbody class="divide-y divide-gray-200">
                <slot name="body"></slot>
            </tbody>
        </table>
    </div>
</template>
