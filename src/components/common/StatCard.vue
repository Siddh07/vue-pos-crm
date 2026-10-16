<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    value?: number | string | null
    fallbackValue?: string
    color?: string
    icon?: string
    subtitle?: string
    trend?: string
    trendUp?: boolean
  }>(),
  {
    value: undefined,
    fallbackValue: '—',
    color: 'bg-blue-600',
    icon: 'mdi-chart-line',
    trendUp: true
  }
)

const hasValue = computed(() => {
  return props.value !== undefined && props.value !== null && props.value !== ''
})

const displayValue = computed(() => {
  return hasValue.value ? props.value : props.fallbackValue
})
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate mb-1">
        {{ title }}
      </p>

      <h3
        class="text-2xl font-bold tracking-tight truncate"
        :class="hasValue ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500 font-normal'"
      >
        {{ displayValue }}
      </h3>

      <p v-if="subtitle || trend" class="text-xs mt-2 flex items-center gap-1.5 flex-wrap">
        <span v-if="trend && hasValue" :class="[
          'px-2 py-1 rounded-full text-xs font-semibold',
          trendUp
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
        ]">
          {{ trend }}
        </span>
        <span v-if="subtitle" class="text-gray-500 dark:text-gray-400">
          {{ subtitle }}
        </span>
      </p>
      <p v-else-if="!hasValue" class="text-xs mt-2 text-gray-400 italic">
        No data available
      </p>
    </div>

    <div v-if="icon || $slots.icon"
      :class="[color, 'w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 ml-4']">
      <slot name="icon">
        <i v-if="icon" :class="icon" class="text-xl"></i>
      </slot>
    </div>
  </div>
</template>