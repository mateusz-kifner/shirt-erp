import { ColorType } from "./ColorType"
import { ImageType } from "./ImageType"

export interface ProductType {
  id: number
  name: string
  category: string
  codeName: string
  color: ColorType
  createdAt: Date
  updatedAt: Date
  desc: string
  iconId: number | null
  previewImg: Partial<ImageType> | null
}
