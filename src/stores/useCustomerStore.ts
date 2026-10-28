import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Customer, CustomerInput } from '@/types/customer'
import { customerService } from '@/services/customerServices'

export const useCustomerStore = defineStore('customer', () => {
    // --- STATE ---
    const customers = ref<Customer[]>([])
    const selectedCustomer = ref<Customer | null>(null)
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)

    // --- GETTERS (Computed) ---
    const totalCustomers = computed(() => customers.value.length)

    const totalPipelineValue = computed(() =>
        customers.value.reduce((sum, customer) => sum + (customer.dealValue || 0), 0)
    )

    // --- ACTIONS ---

    /** Fetch all customers */
    async function fetchCustomers(): Promise<void> {
        loading.value = true
        error.value = null
        try {
            customers.value = await customerService.getAll()
        } catch (err: unknown) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch customers'
            console.error('fetchCustomers error:', err)
        } finally {
            loading.value = false
        }
    }

    /** Fetch a single customer by ID */
    async function fetchCustomerById(id: string): Promise<Customer | null> {
        loading.value = true
        error.value = null
        try {
            const data = await customerService.getById(id)
            selectedCustomer.value = data
            return data
        } catch (err: unknown) {
            error.value = err instanceof Error ? err.message : `Failed to fetch customer ${id}`
            console.error('fetchCustomerById error:', err)
            return null
        } finally {
            loading.value = false
        }
    }

    /** Create a new customer */
    async function addCustomer(payload: CustomerInput): Promise<Customer | null> {
        loading.value = true
        error.value = null
        try {
            const newCustomer = await customerService.create(payload)
            customers.value.push(newCustomer)
            return newCustomer
        } catch (err: unknown) {
            error.value = err instanceof Error ? err.message : 'Failed to add customer'
            console.error('addCustomer error:', err)
            return null
        } finally {
            loading.value = false
        }
    }

    /** Update an existing customer */
    async function updateCustomer(
        id: string,
        payload: Partial<CustomerInput>
    ): Promise<Customer | null> {
        loading.value = true
        error.value = null
        try {
            const updated = await customerService.update(id, payload)
            const index = customers.value.findIndex((c) => c.id === id)
            if (index !== -1) {
                customers.value[index] = updated
            }
            if (selectedCustomer.value?.id === id) {
                selectedCustomer.value = updated
            }
            return updated
        } catch (err: unknown) {
            error.value = err instanceof Error ? err.message : `Failed to update customer ${id}`
            console.error('updateCustomer error:', err)
            return null
        } finally {
            loading.value = false
        }
    }

    /** Delete a customer */
    async function removeCustomer(id: string): Promise<boolean> {
        loading.value = true
        error.value = null
        try {
            await customerService.delete(id)
            customers.value = customers.value.filter((c) => c.id !== id)
            if (selectedCustomer.value?.id === id) {
                selectedCustomer.value = null
            }
            return true
        } catch (err: unknown) {
            error.value = err instanceof Error ? err.message : `Failed to delete customer ${id}`
            console.error('removeCustomer error:', err)
            return false
        } finally {
            loading.value = false
        }
    }

    return {
        // State
        customers,
        selectedCustomer,
        loading,
        error,
        // Getters
        totalCustomers,
        totalPipelineValue,
        // Actions
        fetchCustomers,
        fetchCustomerById,
        addCustomer,
        updateCustomer,
        removeCustomer,
    }
})