export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  company: string
  status: 'Active' | 'Pending' | 'Closed'
  dealValue: number
}

export type CustomerInput = Omit<Customer, 'id'>
