import { AddressType } from "./AddressType"
import { OrderType } from "./OrderType"

export interface ClientType {
  username: string
  firstname: string | null
  lastname: string | null
  email: string | null
  phoneNumber: string | null
  companyName: string | null
  notes: string | null
  secretNotes: string | null
  orders: OrderType[]
  address: Partial<AddressType> | null
  createdAt: Date
  updatedAt: Date
}
