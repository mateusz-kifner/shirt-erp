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
  expenses: any[]
  orders: any[]
  workstations: any[]
  displayName: string | null
  welcomeMessageHash: string
}
