import { FC } from "react"
import { Form, Input } from "antd"

const { TextArea } = Input

interface InputStringProps {
  name: string
  initialValue?: string
  label: string
  disabled?: boolean
  required?: boolean
  multiline?: boolean
}

const InputString: FC<InputStringProps> = ({
  name,
  label,
  disabled,
  required,
  initialValue,
  multiline,
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      initialValue={initialValue ? initialValue : undefined}
      rules={[{ required: required }]}
    >
      {multiline ? <TextArea rows={4} /> : <Input disabled={disabled} />}
    </Form.Item>
  )
}

export default InputString
