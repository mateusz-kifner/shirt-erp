import { ImageType } from "./ImageType"

export interface ProductType {
  id: number
  name: string
  category: string
  codeName: string
  color: {
    colorName: string
    colorHex: string
  }
  createdAt: Date
  updatedAt: Date
  desc: string
  icon: Partial<ImageType> | null
  previewImg: Partial<ImageType> | null
}
