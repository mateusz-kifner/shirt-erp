import { FC, useState } from "react"
import { Form, Card, Modal, Button } from "antd"
import { DeleteFilled, PlusOutlined } from "@ant-design/icons"

import UsersList from "../../pages/users/UsersList"
import { user_template } from "../../pages/users/UsersPage"

import { UserType } from "../../types/UserType"
import { UserPicker } from "./InputUser"

const { Meta } = Card

interface InputUsersProps {
  name: string
  initialValue?: UserType[]
  label: string
  disabled?: boolean
  required?: boolean
}

const InputUsers: FC<InputUsersProps> = ({
  name,
  label,
  disabled,
  required,
  initialValue,
}) => {
  return (
    <Form.Item
      name={name}
      // label={label}
      initialValue={initialValue}
      rules={[{ required: required }]}
      wrapperCol={{ span: undefined }}
    >
      {/* @ts-ignore */}
      <UsersPicker label={label} />
    </Form.Item>
  )
}

interface OnChangeHandler {
  (e: any): void
}
interface UsersPickerProps {
  value: Partial<UserType>[]
  onChange: OnChangeHandler
  label?: string
}
export const UsersPicker: FC<UsersPickerProps> = ({
  value,
  onChange,
  label,
}) => {
  return (
    <Card
      style={{ width: "100%" }}
      size="small"
      title={<span>{label}</span>}
      bodyStyle={{
        display: "flex",
        gap: "0.25rem",
        padding: "0.rem",
        flexDirection: "column",
      }}
    >
      {value &&
        value.map((user: Partial<UserType> | null, index: number) => (
          <UserPicker
            key={"user" + index}
            value={user as Partial<UserType>}
            onChange={(new_user) => {
              onChange(
                value
                  .map((val: Partial<UserType>, i: number) => {
                    if (i == index) {
                      return { ...new_user }
                    }
                    return val
                  })
                  .filter((val) => val != null),
              )
            }}
          />
        ))}
      <Button
        onClick={() => (value ? onChange([...value, null]) : onChange([null]))}
        type="primary"
      >
        <PlusOutlined />
      </Button>
    </Card>
  )
}

export default InputUsers
