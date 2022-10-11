import { ComponentType } from "react"

// Make it work with arrays

interface EditableGroupProps {
  label?: string
  value?: any[] | null
  initialValue?: any[] | null
  onSubmit?: (value: any[] | null) => void
  disabled?: boolean
  required?: boolean
  Elements: ComponentType<any>[]
}

import React from "react"

const EditableGroup = (props: EditableGroupProps) => {
  return <div>EditableGroup</div>
}

export default EditableGroup
