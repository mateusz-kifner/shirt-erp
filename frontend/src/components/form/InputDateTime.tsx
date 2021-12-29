import { FC } from "react"
import { DatePicker, Form, TimePicker } from "antd"

import moment from "moment"

interface InputDateTimeProps {
  name: string
  initialValue?: string
  label: string
  disabled?: boolean
  required?: boolean
}

const InputDateTime: FC<InputDateTimeProps> = ({
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
      {/* @ts-ignore */}
      <DateTime disabled={disabled} />
    </Form.Item>
  )
}
interface OnChangeHandler {
  (e: string): void
}
interface DateTimeProps {
  value: string
  onChange: OnChangeHandler
  disabled?: boolean
}
const DateTime: FC<DateTimeProps> = ({ value, onChange, disabled }) => {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <DatePicker
        disabled={disabled}
        value={moment(value)}
        onChange={(val) => val && onChange(val?.toISOString())}
      />
      <TimePicker
        disabled={disabled}
        format={"HH:mm"}
        value={moment(value)}
        onChange={(val) => val && onChange(val?.toISOString())}
      />
    </div>
  )
}

export default InputDateTime
