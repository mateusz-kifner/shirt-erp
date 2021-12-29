import { FC, useState } from "react"
import { Input, Modal, Button, Form, Typography } from "antd"
import { UserOutlined, LockFilled } from "@ant-design/icons"

import axios from "axios"
import { useRecoilState } from "recoil"

import { loginState } from "../atoms/loginState"

const { Text } = Typography

const LoginPage: FC = () => {
  // const [modalVisible, setModalVisible] = useState(true)
  const [login, setLogin] = useRecoilState(loginState)
  const [errorMessage, setErrorMessage] = useState(false)
  // const navigate = useNavigate()

  const onSubmit = (logindata: { identifier: string; password: string }) => {
    console.log("data", logindata)
    axios
      .post("/auth/local", logindata)
      .then(function (response) {
        setLogin(response.data)
        console.log(response)
      })
      .catch(function (error) {
        setErrorMessage(true)
        console.log(error)
      })
  }

  return (
    <Modal title="Login" visible={true} centered footer={[]}>
      <Form
        name="loginForm"
        // initialValues={{ remember: true }}
        onFinish={onSubmit}
        onFinishFailed={() => {}}
        autoComplete="on"
      >
        <Form.Item
          name="identifier"
          rules={[{ required: true, message: "Podaj login lub email!" }]}
        >
          <Input
            size="large"
            placeholder="login lub email"
            prefix={<UserOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Podaj hasło!" }]}
        >
          <Input.Password
            size="large"
            placeholder="hasło"
            prefix={<LockFilled />}
          />
        </Form.Item>
        {errorMessage && (
          <Form.Item label="Error">
            <Text type="danger">Niepoprawny login lub hasło</Text>
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Zaloguj
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default LoginPage
