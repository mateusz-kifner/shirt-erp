import { ReactNode } from "react"

interface EditableInput<T> {
  label?: string
  value?: T
  initialValue?: T
  onSubmit?: (value: T | null) => void
  disabled?: boolean
  required?: boolean
  active?: boolean
  leftSection?: ReactNode
  rightSection?: ReactNode
}

export default EditableInput
