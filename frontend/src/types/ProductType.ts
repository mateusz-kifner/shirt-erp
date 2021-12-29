import { ImageType } from "./ImageType";

export interface ProductType {
  id: number
  name: string
  category: string
  codeName: string
  color: {
    colorName: string
    colorHex: string
  }
  created_at: Date
  updated_at: Date
  desc: string
  icon: Partial<ImageType> | null
  previewImg: Partial<ImageType> | null
}