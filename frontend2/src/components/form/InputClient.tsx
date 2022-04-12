import { FC, useState } from "react"
import { Form, Card, Modal, Button } from "antd"
import { DeleteFilled } from "@ant-design/icons"

import ClientsList from "../../pages/clients/ClientsList"
import { client_template } from "../../pages/clients/ClientsPage"

import { ClientType } from "../../types/ClientType"

const { Meta } = Card

interface InputClientProps {
  name: string
  initialValue?: ClientType
  label: string
  disabled?: boolean
  required?: boolean
}

const InputClient: FC<InputClientProps> = ({
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
      <ClientPicker />
    </Form.Item>
  )
}

interface OnChangeHandler {
  (e: any): void
}
interface ClientPickerProps {
  value: Partial<ClientType>
  onChange: OnChangeHandler
}
const ClientPicker: FC<ClientPickerProps> = ({ value, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [currentClient, setCurrentClient] = useState<Partial<ClientType>>(value)
  console.log("klient input", value)
  return (
    <>
      <Modal
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => {
          onChange(currentClient)
          setModalOpen(false)
        }}
      >
        <ClientsList
          template={client_template}
          onItemClick={setCurrentClient}
        />
      </Modal>
      <div style={{ position: "relative" }}>
        <Button style={{ height: "100%", width: "100%", padding: 0 }}>
          <Card
            onClick={() => setModalOpen(true)}
            style={{ height: "100%", width: "100%" }}
          >
            {value ? (
              <Meta
                avatar={
                  <div
                    style={{
                      height: 48,
                      width: 48,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "var(--gray)",
                      borderRadius: "100%",
                      fontSize: 24,
                      color: "var(--background1)",
                    }}
                  >
                    {(value.firstname ? value.firstname[0] : "") +
                      (value.lastname ? value.lastname[0] : "")}
                  </div>
                }
                title={
                  (value.firstname ? value.firstname : "") +
                  " " +
                  (value.lastname ? value.lastname : "") +
                  (value.companyName && value.companyName?.length > 0
                    ? ` (${value.companyName})`
                    : "")
                }
                description={
                  value.username +
                  (value.email && value.email?.length > 0
                    ? ` (${value.email})`
                    : "")
                }
              />
            ) : (
              <Meta title="Nie podano klienta" />
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

export default InputClient
