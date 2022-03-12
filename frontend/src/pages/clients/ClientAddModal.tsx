import { FC } from "react"
import { Modal } from "antd"

import useForm from "antd/lib/form/hooks/useForm"

import Form from "../../components/form/Form"
import useStrapi from "../../hooks/useStrapi"

interface ClientAddModalProps {
  title: string
  visible: boolean
  setVisible: (visible: boolean) => void
  data: any
  onUpdate?: () => void
}

const ClientAddModal: FC<ClientAddModalProps> = ({
  title,
  visible,
  setVisible,
  data,
  onUpdate,
}) => {
  const [form] = useForm()
  const { add } = useStrapi("clients", undefined, {
    addMutationOptions: {
      errorMessage: "Błąd w dodawaniu klienta",
      successMessage: "Klient dodany",
      onSuccess: onUpdate,
      onError: () => form.resetFields(),
      onSettled: () => setVisible(false),
    },
  })

  return (
    <Modal
      title={title}
      centered
      visible={visible}
      onCancel={() => setVisible(false)}
      width={800}
      okText="Dodaj Klienta"
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            add(values)
            form.resetFields()
          })
          .catch((info) => {
            console.log("Validate Failed:", info)
          })
      }}
    >
      <Form
        form={form}
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 8 }}
        data={data}
        onFinish={add}
        onFinishFailed={() => {
          form.resetFields()
          setVisible(false)
        }}
      />
    </Modal>
  )
}

export default ClientAddModal
