import { FC } from "react"
import { Form, Select } from "antd"

import { v4 as uuidv4 } from "uuid"

const { Option } = Select

interface InputEnumProps {
  name: string
  initialValue?: string
  label: string
  disabled?: boolean
  required?: boolean

  enum_data: string[]
}

const InputEnum: FC<InputEnumProps> = ({
  name,
  label,
  disabled,
  initialValue,
  required,
  enum_data,
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      initialValue={initialValue}
      rules={[{ required: required }]}
    >
      <Select
        showSearch
        optionFilterProp="children"
        filterOption={(input, option: any) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        disabled={disabled}
      >
        {enum_data.map((value: string) => (
          <Option value={value} key={uuidv4()}>
            {value}
          </Option>
        ))}
      </Select>
    </Form.Item>
  )
}

export default InputEnum
