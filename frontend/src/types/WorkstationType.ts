import { ImageType } from "./ImageType"

export interface WorkstationType {
  id: number
  name: string
  desc: string | null
  numberOfJobs: number
  created_at: Date
  updated_at: Date
  icon: ImageType | null
  nextWorkstations: WorkstationType[]
}
