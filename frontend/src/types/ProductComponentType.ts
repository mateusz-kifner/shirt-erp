import { ProductType } from "./ProductType"

export interface ProductComponentType {
  id?: number
  count: number
  product: Partial<ProductType> | null
  size: string | null
  notes?: string | null
  ready: boolean
}
