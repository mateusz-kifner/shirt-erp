export interface UserType {
  id: number
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
  created_at: string
  updated_at: string
  darkMode: boolean
  expenses: any[]
  orders: any[]
  workstations: any[]
  displayName: string | null
}
