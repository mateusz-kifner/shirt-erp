import { ExpenseType } from "./ExpenseType"
import { OrderType } from "./OrderType"
import { WorkstationType } from "./WorkstationType"

export interface UserType {
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  role: {
    id: number
    name: string
    description: string
    type: string
  }
  createdAt: string
  updatedAt: string
  darkMode: boolean
  expenses: Partial<ExpenseType>[]
  orders: Partial<OrderType>[]
  workstations: Partial<WorkstationType>[]
  displayName: string | null
  welcomeMessageHash: string
}
