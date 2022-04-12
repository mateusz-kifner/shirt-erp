import { FC, useState } from "react"
import { Form, Card, Modal, Button } from "antd"
import { DeleteFilled } from "@ant-design/icons"

import UsersList from "../../pages/users/UsersList"
import { user_template } from "../../pages/users/UsersPage"

import { UserType } from "../../types/UserType"

const { Meta } = Card

interface InputUserProps {
  name: string
  initialValue?: UserType
  label: string
  disabled?: boolean
  required?: boolean
}

const InputUser: FC<InputUserProps> = ({
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
      initialValue={initialValue}
      rules={[{ required: required }]}
    >
      {/* @ts-ignore */}
      <UserPicker />
    </Form.Item>
  )
}

interface OnChangeHandler {
  (e: any): void
}
interface UserPickerProps {
  value: Partial<UserType>
  onChange: OnChangeHandler
}
export const UserPicker: FC<UserPickerProps> = ({ value, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<Partial<UserType>>(value)
  console.log("user input", value)
  return (
    <>
      <Modal
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => {
          onChange(currentUser)
          setModalOpen(false)
        }}
      >
        <UsersList template={user_template} onItemClick={setCurrentUser} />
      </Modal>
      <div style={{ position: "relative" }}>
        <Button style={{ height: "100%", width: "100%", padding: 0 }}>
          <Card
            onClick={() => setModalOpen(true)}
            style={{ height: "100%", width: "100%" }}
          >
            {value ? (
              <Meta
                // avatar={
                //   <div
                //     style={{
                //       height: 48,
                //       width: 48,
                //       display: "flex",
                //       justifyContent: "center",
                //       alignItems: "center",
                //       backgroundColor: "var(--gray)",
                //       borderRadius: "100%",
                //       fontSize: 24,
                //       color: "var(--background1)",
                //     }}
                //   >
                //     {""}
                //   </div>
                // }
                title={value?.displayName ? value?.displayName : ""}
                description={value.username}
              />
            ) : (
              <Meta title="Nie podano pracownika" />
            )}
          </Card>
        </Button>
        {value && (
          <Button
            onClick={() => onChange(null)}
            style={{ position: "absolute", right: 0, top: 0, height: "100%" }}
          >
            <DeleteFilled />
          </Button>
        )}
      </div>
    </>
  )
}

export default InputUser
