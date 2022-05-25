import { Select } from "@mantine/core"
import React, { FC } from "react"

interface InputEnumProps {
  label?: string
  placeholder?: string
  enum_data?: string[]
  value?: string
  onChange?: (value: string | null) => void
  disabled?: boolean
  required?: boolean
}

const InputEnum: FC<InputEnumProps> = (props) => {
  const enum_data = props.enum_data ? props.enum_data : []
  return (
    <Select
      {...props}
      data={enum_data.map((val: string) => ({ value: val, label: val }))}
    />
  )
}

export default InputEnum
