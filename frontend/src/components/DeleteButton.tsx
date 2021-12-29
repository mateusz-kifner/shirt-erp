import { Button } from "antd"
import Modal from "antd/lib/modal/Modal"
import { title } from "process"
import { FC, useState } from "react"

interface DeleteButtonProps {
  message: String
  title: string
  onClick: () => void
  warn?: boolean
}

const DeleteButton: FC<DeleteButtonProps> = ({
  message,
  onClick,
  title,
  warn,
}) => {
  const [visible, setVisible] = useState<boolean>(false)
  return (
    <div>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => onClick()}
        okText={title}
        title={title}
        okButtonProps={{ danger: true, type: "ghost" }}
        cancelButtonProps={{ type: "primary" }}
      >
        {message}
      </Modal>
      <Button danger type="primary" onClick={() => setVisible(true)}>
        {title}
      </Button>
    </div>
  )
}

export default DeleteButton
