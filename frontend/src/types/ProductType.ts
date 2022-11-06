import { FileType } from "./FileType"

export interface ProductType {
  id: number
  name: string
  category: string
  desc: string
  iconId: number | null
  previewImg: Partial<FileType> | null
  variants: any
  createdAt: Date
  updatedAt: Date
}
