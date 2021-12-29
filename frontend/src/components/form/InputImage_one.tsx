import { FC, useState } from "react"
import { Upload, message } from "antd"
import { CloseOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { RcFile, UploadChangeParam } from "antd/lib/upload"
import { UploadFile } from "antd/lib/upload/interface"

//FIXME: this is broken

function getBase64(img: any, callback: Function) {
  const reader = new FileReader()
  reader.addEventListener("load", () => callback(reader.result))
  reader.readAsDataURL(img)
}

function beforeUpload(file: RcFile, FileList: RcFile[]) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!")
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!")
  }
  return isJpgOrPng && isLt2M
}

const InputImage: FC = () => {
  const [status, setStatus] = useState<"uploading" | "done" | "error">("done")
  const [imageUrl, setImageUrl] = useState<any>(null)

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    console.log(info)
    if (info.file.status === "error") {
      setStatus("error")
      return
    }
    if (info.file.status === "uploading") {
      setStatus("uploading")
      return
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(
        info.file.originFileObj,
        (imageUrl: string | ArrayBuffer | null) => {
          setStatus("done")
          setImageUrl(imageUrl)
        },
      )
    }
  }

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
      ) : (
        <div>
          {status == "uploading" && (
            <>
              <LoadingOutlined />
              <div style={{ marginTop: 8 }}>Uploading</div>
            </>
          )}
          {status == "done" && (
            <>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Click to upload</div>
            </>
          )}
          {status == "error" && (
            <>
              <CloseOutlined />
              <div style={{ marginTop: 8 }}>Error</div>
            </>
          )}
        </div>
      )}
    </Upload>
  )
}

export default InputImage
