import { FC } from "react"
import { Form, InputNumber as InputNumberAntd } from "antd"

interface InputMoneyProps {
  name: string
  initialValue?: number
  label: string
  disabled?: boolean
  required?: boolean

  max?: number
  step?: number
}

const InputMoney: FC<InputMoneyProps> = ({
  name,
  label,
  disabled,
  initialValue,
  required,

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
        min={0}
        max={max}
        step={step}
        precision={2}
        parser={(displayValue: string | undefined) => {
          return displayValue ? parseFloat(displayValue.replace(",", ".")) : 0
        }}
        addonAfter="PLN"
      />
    </Form.Item>
  )
}

export default InputMoney
