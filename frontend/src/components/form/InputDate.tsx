import { FC } from "react"
import { DatePicker, Form } from "antd"

import moment from "moment"

interface InputDateProps {
  name: string
  initialValue?: string
  label: string
  disabled?: boolean
  required?: boolean
}

const InputDate: FC<InputDateProps> = ({
  name,
  label,
  disabled,
  required,

  initialValue,
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      initialValue={moment(initialValue)}
      rules={[{ required: required }]}
    >
      <DatePicker disabled={disabled} />
    </Form.Item>
  )
}

export default InputDate
