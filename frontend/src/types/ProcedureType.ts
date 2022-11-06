import { FileType } from "./FileType"

export interface ProcedureWorkstationsType {
  prevId: number
  nextId: number
}

export interface ProcedureType {
  id?: number
  name: string
  desc: string | null
  icon: FileType
  createdAt: Date
  updatedAt: Date
  workstations: ProcedureWorkstationsType[]
}
