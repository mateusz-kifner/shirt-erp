import { FC, forwardRef } from "react"
import { Form } from "antd"

import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns"
import { PickerTimeProps } from "antd/es/date-picker/generatePicker"

import generatePicker from "antd/es/date-picker/generatePicker"
import "antd/es/date-picker/style/index"
const DatePicker = generatePicker<Date>(dateFnsGenerateConfig)

interface TimePickerProps extends Omit<PickerTimeProps<Date>, "picker"> {}

const TimePicker = forwardRef<any, TimePickerProps>((props, ref) => {
  return <DatePicker {...props} picker="time" mode={undefined} ref={ref} />
})

TimePicker.displayName = "TimePicker"

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
      initialValue={initialValue ? new Date(initialValue) : new Date()}
      rules={[{ required: required }]}
    >
      {/* @ts-ignore */}
      <DateTime disabled={disabled} />
    </Form.Item>
  )
}
interface OnChangeHandler {
  (e: Date): void
}
interface DateTimeProps {
  value: Date
  onChange: OnChangeHandler
  disabled?: boolean
}
const DateTime: FC<DateTimeProps> = ({ value, onChange, disabled }) => {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <DatePicker
        disabled={disabled}
        value={value}
        onChange={(val) => val && onChange(val)}
      />
      <TimePicker
        disabled={disabled}
        format={"HH:mm"}
        value={value}
        onChange={(val) => val && onChange(val)}
      />
    </div>
  )
}

export default InputDateTime
