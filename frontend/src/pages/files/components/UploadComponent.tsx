import { FC, useState } from "react"
import { Upload, Button } from "antd"
import { InboxOutlined } from "@ant-design/icons"

import axios, { AxiosError } from "axios"

const { Dragger } = Upload
const serverURL = (import.meta.env.SERVER_URL ||
  (function () {
    let origin_split = window.location.origin.split(":")
    return `${origin_split[0]}:${origin_split[1]}:1337/api`
  })()) as string

const UploadComponent: FC = () => {
  const [fileList, setFileList] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<any>()

  const handleUpload = () => {
    console.log(fileList)

    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append("files", file)
    })

    setUploading(true)
    console.log(JSON.stringify(formData))
    axios
      .post(serverURL + "/upload", formData)
      .then((value) => {
        setUploading(false)
        setFileList([])
        // setFiles((val) => [...val, value.data])
        console.log(value)
      })
      .catch((err: AxiosError) => {
        setError(err.response?.statusText)
        setUploading(false)
        console.log({ ...err })
      })
  }

  const onRemove = (file: any) => {
    console.log(file, fileList)
    setFileList((value: any[]) => {
      const index = value.indexOf(file)
      const newFileList = value.slice()
      return newFileList.splice(index, 1)
    })
  }

  const beforeUpload = (file: any) => {
    console.log(file, fileList)
    setFileList((value: any[]) => [...value, file])
    return false
  }

  return (
    <div>
      {/* <div style={{ height: "50%" }}> */}
      <Dragger
        name="file"
        multiple={true}
        beforeUpload={beforeUpload}
        onRemove={onRemove}
        style={{
          minHeight: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Dragger>
      {error && "Error: " + error}
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? "Uploading" : "Start Upload"}
      </Button>
    </div>
  )
}
export default UploadComponent
