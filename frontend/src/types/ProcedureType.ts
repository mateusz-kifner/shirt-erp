import { ImageType } from "./ImageType"

export interface ProcedureWorkstationsType {
  prevId: number
  nextId: number
}

export interface ProcedureType {
  id?: number
  name: string
  desc: string | null
  icon: ImageType
  createdAt: Date
  updatedAt: Date
  workstations: ProcedureWorkstationsType[]
}
