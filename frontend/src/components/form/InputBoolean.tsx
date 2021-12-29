import { FC } from "react"
import { Checkbox, ColProps, Form, Switch } from "antd"

interface InputBooleanProps {
  name: string
  initialValue?: boolean
  label: string
  disabled?: boolean
  required?: boolean
  checkbox?: boolean
  labelCol?: ColProps
  wrapperCol?: ColProps
  children?: { checked: string; unchecked: string }
}

const InputBoolean: FC<InputBooleanProps> = ({
  name,
  label,
  disabled,
  required,
  initialValue,
  checkbox,
  labelCol,
  wrapperCol,
  children,
}) => {
  if (checkbox)
    return (
      <Form.Item
        name={name}
        valuePropName="checked"
        initialValue={initialValue}
        wrapperCol={{
          offset: labelCol?.span,
          span: wrapperCol?.span,
        }}
        rules={[{ required: required }]}
      >
        <Checkbox disabled={disabled}>{label}</Checkbox>
      </Form.Item>
    )
  else
    return (
      <Form.Item
        label={label}
        name={name}
        valuePropName="checked"
        initialValue={initialValue}
      >
        <Switch
          checkedChildren={children?.checked ? children.checked : undefined}
          unCheckedChildren={
            children?.unchecked ? children.unchecked : undefined
          }
          disabled={disabled}
        />
      </Form.Item>
    )
}

export default InputBoolean
