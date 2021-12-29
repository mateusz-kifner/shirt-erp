import { FC, useState } from "react"
import { Input, Modal } from "antd"
import DebugComponent from "../../components/DebugComponent"

const { TextArea } = Input

interface JsonParseModalProps {
  visible?: boolean
  onCancel?: () => void
}

const JsonParseModal: FC<JsonParseModalProps> = ({ visible, onCancel }) => {
  const [json, setJson] = useState<any>({})
  return (
    <Modal visible={visible} onCancel={onCancel} onOk={onCancel}>
      <TextArea
        rows={6}
        onChange={(e) => {
          let data = e.target.value.replace(/\\/g, "")
          console.log(data)
          let new_data
          try {
            new_data = JSON.parse(data)
          } catch {}
          setJson(new_data)
        }}
        style={{}}
      />
      <DebugComponent data={json} />
    </Modal>
  )
}

export default JsonParseModal
