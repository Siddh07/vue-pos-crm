<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    value: number | string
    color?: string
    icon?: string
    subtitle?: string
    trend?: string
    trendUp?: boolean
  }>(),
  {
    color: 'bg-blue-600',
    icon: 'mdi-chart-line',
    trendUp: true
  }
)
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate mb-1">
        {{ title }}
      </p>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
        {{ value }}
      </h3>
      <p v-if="subtitle || trend" class="text-xs mt-2 flex items-center gap-1.5 flex-wrap">
        <span
          v-if="trend"
          :class="trendUp ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'"
        >
          {{ trend }}
        </span>
        <span v-if="subtitle" class="text-gray-500 dark:text-gray-400">
          {{ subtitle }}
        </span>
      </p>
    </div>

    <div
      v-if="icon || $slots.icon"
      :class="[color, 'w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 ml-4']"
    >
      <slot name="icon">
        <i v-if="icon" :class="icon" class="text-xl"></i>
      </slot>
    </div>
  </div>
</template>