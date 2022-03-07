import { ImageType } from "./ImageType"

export interface WorkstationType {
  id: number
  name: string
  desc: string | null
  numberOfJobs: number
  createdAt: Date
  updatedAt: Date
  icon: ImageType | null
  nextWorkstations: WorkstationType[]
}
