import { FC } from "react"
import { Form, InputNumber as InputNumberAntd } from "antd"

import { useRecoilValue } from "recoil"
import { loginState } from "../../atoms/loginState"

interface InputIDProps {
  name: string
  initialValue?: number
  label: string
  disabled?: boolean
}

const InputID: FC<InputIDProps> = ({ name, label, initialValue }) => {
  const login = useRecoilValue(loginState)

  return (
    <Form.Item
      name={name}
      label={label}
      initialValue={initialValue}
      style={login.debug ? undefined : { display: "none" }}
    >
      <InputNumberAntd step={1} min={0} disabled={true} />
    </Form.Item>
  )
}

export default InputID
