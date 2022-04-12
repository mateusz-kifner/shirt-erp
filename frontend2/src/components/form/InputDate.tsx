import { FC } from "react"
import { Form } from "antd"

import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns"
import generatePicker from "antd/es/date-picker/generatePicker"
import "antd/es/date-picker/style/index"
const DatePicker = generatePicker<Date>(dateFnsGenerateConfig)

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
      initialValue={initialValue ? new Date(initialValue) : new Date()}
      rules={[{ required: required }]}
    >
      <DatePicker
        disabled={disabled}
        onChange={(date, datestring) => console.log(date, datestring)}
      />
    </Form.Item>
  )
}

export default InputDate
