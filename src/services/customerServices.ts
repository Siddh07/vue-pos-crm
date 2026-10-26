import { apiClient } from './api'
import type { Customer, CustomerInput } from '@/types/customer'

export const customerService = {
    async getAll(): Promise<Customer[]> {
        const response = await apiClient.get<Customer[]>('/customers')
        return response.data
    },

    async getById(id: string): Promise<Customer> {
        const response = await apiClient.get<Customer>(`/customers/${id}`)
        return response.data
    },

    async create(payload: CustomerInput): Promise<Customer> {
        const response = await apiClient.post<Customer>('/customers', payload)
        return response.data
    },

    async update(id: string, payload: Partial<CustomerInput>): Promise<Customer> {
        const response = await apiClient.put<Customer>(`/customers/${id}`, payload)
        return response.data
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/customers/${id}`)
    },
}