import { AddressType } from "./AddressType"
import { ClientType } from "./ClientType"
import { ExpensesType } from "./ExpensesType"
import { FileType } from "./FileType"
import { ProductComponentType } from "./ProductComponentType"
import { UserType } from "./UserType"

export interface OrderType {
  name: string
  status: string
  notes: string | null
  price: number
  isPricePaid: boolean
  advance: number
  isAdvancePaid: boolean
  dateOfCompletion: Date
  secretNotes: string | null
  files: Partial<FileType>[]
  address: Partial<AddressType>
  products: ProductComponentType[]
  client: Partial<ClientType>
  // expenses: Partial<ExpensesType>[]
  employees: Partial<UserType>[]
  createdAt: Date
  updatedAt: Date
}
