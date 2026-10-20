<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const customerId = computed(() => route.params.id)
const tabs = [
    { id: 'profile', label: 'Profile Info' },
    { id: 'transactions', label: 'POS Transactions' },
    { id: 'activity', label: 'Activity Log' }
] as const
type TabId = typeof tabs[number]['id']
const activeTab = ref<TabId>('profile')

watch(customerId, () => { activeTab.value = 'profile' })

function navigateTabs(event: KeyboardEvent, index: number) {
    let nextIndex: number
    switch (event.key) {
        case 'ArrowRight': nextIndex = (index + 1) % tabs.length; break
        case 'ArrowLeft': nextIndex = (index + tabs.length - 1) % tabs.length; break
        case 'Home': nextIndex = 0; break
        case 'End': nextIndex = tabs.length - 1; break
        default: return
    }
    event.preventDefault()
    const tab = tabs[nextIndex]
    if (!tab) return
    activeTab.value = tab.id
    document.getElementById(`customer-tab-${tab.id}`)?.focus()
}
</script>

<template>
    <section class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <header class="space-y-3">
            <RouterLink :to="{ name: 'crm' }"
                class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                Back to customers
            </RouterLink>
            <h1 class="text-2xl font-bold">Customer Details</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">Customer ID: {{ customerId }}</p>
        </header>

        <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div role="tablist" aria-label="Customer details"
                class="flex overflow-x-auto border-b border-gray-200 px-4 dark:border-gray-700">
                <button v-for="(tab, index) in tabs" :id="`customer-tab-${tab.id}`" :key="tab.id"
                    type="button" role="tab" :aria-selected="activeTab === tab.id"
                    :aria-controls="`customer-panel-${tab.id}`" :tabindex="activeTab === tab.id ? 0 : -1"
                    class="shrink-0 border-b-2 px-4 py-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-500"
                    :class="activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                        : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'"
                    @click="activeTab = tab.id" @keydown="navigateTabs($event, index)">
                    {{ tab.label }}
                </button>
            </div>

            <div v-for="tab in tabs" :id="`customer-panel-${tab.id}`" :key="tab.id"
                role="tabpanel" :aria-labelledby="`customer-tab-${tab.id}`" :hidden="activeTab !== tab.id"
                tabindex="0" class="p-6 focus-visible:outline-blue-500">
                <h2 class="text-lg font-semibold">{{ tab.label }}</h2>
                <p v-if="tab.id === 'profile'" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Profile information for customer {{ customerId }} will appear here.
                </p>
                <p v-else-if="tab.id === 'transactions'" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    POS transactions for customer {{ customerId }} will appear here.
                </p>
                <p v-else class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Activity for customer {{ customerId }} will appear here.
                </p>
            </div>
        </div>
    </section>
</template>
