export interface WorkstationType {
  id?: number
  name: string
  description: string | null
  numberOfJobs: number
  createdAt: Date
  updatedAt: Date
  iconId: number | null
  nextWorkstations: WorkstationType[]
}
