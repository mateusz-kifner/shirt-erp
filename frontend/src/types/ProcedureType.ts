import { ImageType } from "./ImageType"

export interface ProcedureWorkstationsType {
  id: number
  prevId: number
  nextId: number
}

export interface ProcedureType {
  id: number
  name: string
  desc: string | null
  icon: ImageType
  created_at: Date
  updated_at: Date
  workstations: ProcedureWorkstationsType[]
}
