import { Input } from "@mantine/core"
import React from "react"
import { FileType } from "../../types/FileType"

interface EditableDesignProps {
  label?: string
  value?: any
  initialValue?: any
  onSubmit?: (value: any | null) => void
  disabled?: boolean
  required?: boolean
  files?: FileType[]
}

const EditableDesign = (props: EditableDesignProps) => {
  const { label, value, initialValue, onSubmit, disabled, required, files } =
    props
  return (
    <Input.Wrapper label={label}>
      <div>Design editor</div>
    </Input.Wrapper>
  )
}

export default EditableDesign
