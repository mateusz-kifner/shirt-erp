import { FC } from "react"
import { Form, InputNumber as InputNumberAntd } from "antd"

interface InputNumberProps {
  name: string
  initialValue?: number
  label: string
  disabled?: boolean
  required?: boolean
  min?: number
  max?: number
  step?: number
}

const InputNumber: FC<InputNumberProps> = ({
  name,
  label,
  disabled,
  initialValue,
  required,
  min,
  max,
  step,
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      initialValue={initialValue}
      rules={[{ required: required }]}
    >
      <InputNumberAntd
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        parser={(displayValue: string | undefined) => {
          return displayValue ? parseFloat(displayValue.replace(",", ".")) : 0
        }}
      />
    </Form.Item>
  )
}

export default InputNumber
