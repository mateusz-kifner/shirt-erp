import { FC, useState } from "react"
import { Button, Modal, Upload } from "antd"
import { InboxOutlined } from "@ant-design/icons"

import useFiles from "../hooks/useFiles"

import FilesList from "../pages/files/components/FilesList"

import { FileType } from "../types/FileType"

import styles from "./FilesButton.module.css"

const { Dragger } = Upload

interface FilesButtonProps {
  onChange?: (files: FileType[]) => void
}

const FilesButton: FC<FilesButtonProps> = ({ onChange }) => {
  const [filesModalVisible, setFilesModalVisible] = useState(false)
  const [filesSelected, setFilesSelected] = useState<FileType[]>([])
  const [files] = useFiles()

  const onSelect = (ids: number[]) => {
    setFilesSelected(() =>
      files.filter((file) => -1 < ids.findIndex((id) => id === file.id)),
    )
  }

  return (
    <div>
      <Button onClick={() => setFilesModalVisible(true)}>Select File</Button>
      <div style={{ position: "absolute" }}>
        <Modal
          visible={filesModalVisible}
          onCancel={() => setFilesModalVisible(false)}
          width={1160}
        >
          <div className={styles.container}>
            <div className={styles.topFiles}>
              <Dragger>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
              </Dragger>
              <FilesList files={filesSelected} />
            </div>
            <div className={styles.bottomFiles}>
              <FilesList onSelect={onSelect} files={files} search />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default FilesButton
