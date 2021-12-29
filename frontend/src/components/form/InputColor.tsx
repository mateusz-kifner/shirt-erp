import { FC } from "react"
import { Form } from "antd"

import InputColorAntd from "./InputColorAntd"

interface InputColorProps {
  name: string
  initialValue?: { colorName: string; colorHex: string }
  label: string
  disabled?: boolean
  showText?: boolean
}

const InputColor: FC<InputColorProps> = ({
  name,
  label,
  disabled,
  initialValue,
  showText,
}) => {
  return (
    <Form.Item name={name} label={label} initialValue={initialValue}>
      {/* @ts-ignore */}
      <InputColorAntd disabled={disabled} showText={showText} />
    </Form.Item>
  )
}

export default InputColor
