export interface ExpenseType {
  id?: number
  name: string
  price: number
  items: any[]

  createdAt: Date
  updatedAt: Date
}
