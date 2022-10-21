import { ImageType } from "./ImageType"

export interface ProductType {
  id: number
  name: string
  category: string
  desc: string
  iconId: number | null
  previewImg: Partial<ImageType> | null
  variant: Object
  createdAt: Date
  updatedAt: Date
}
