import { Checkbox, Switch } from "@mantine/core"
import React, { ChangeEvent, FC } from "react"

interface InputBooleanProps {
  label?: string
  value?: string | number | readonly string[] | undefined
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  required?: boolean
  checkbox?: boolean
}

const InputBoolean: FC<InputBooleanProps> = (props) => {
  let new_props = { ...props }
  delete new_props.checkbox
  return props?.checkbox ? (
    <Checkbox {...new_props} />
  ) : (
    <Switch {...new_props} />
  )
}

export default InputBoolean
