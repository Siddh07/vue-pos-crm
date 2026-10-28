export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: 'Active' | 'Pending' | 'Closed'
  dealValue: number
}

export type CustomerInput = Omit<Customer, 'id'>