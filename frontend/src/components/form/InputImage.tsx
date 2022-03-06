import { FC, useState } from "react"
import { Button, Form, Upload } from "antd"

const serverURL = (import.meta.env.SERVER_URL ||
  (function () {
    let origin_split = window.location.origin.split(":")
    return `${origin_split[0]}:${origin_split[1]}:1337/api`
  })()) as string

interface InputImageProps {
  name: string
  initialValue?: string
  label: string
  disabled?: boolean
  required?: boolean
}

const normFile = (e: any) => {
  console.log("Upload event:", e)
  if (Array.isArray(e)) {
    return e
  }
  return e && e.fileList
}

const InputImage: FC<InputImageProps> = ({
  name,
  label,
  disabled,
  initialValue,
  required,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [previewTitle, setPreviewTitle] = useState("")
  const [fileList, setFileList] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  // const [files, setFiles] = useRecoilState(filesState)
  const [error, setError] = useState<any>()

  const handleUpload = () => {
    console.log(fileList)

    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append("files", file)
    })

    setUploading(true)

    // axios
    //   .post(serverURL + "/upload", formData)
    //   .then((value) => {
    //     setUploading(false)
    //     // setFileList([])
    //     // setFiles((val) => [...val, value.data])
    //     console.log(value)
    //   })
    //   .catch((err: AxiosError) => {
    //     setError(err.response?.statusText)
    //     setUploading(false)
    //     console.log({ ...err })
    //   })
  }

  const onRemove = (file: any) => {
    console.log(file, fileList)
    setFileList([])
  }

  const beforeUpload = (file: any) => {
    console.log(file, fileList)
    setFileList([file])
    return false
  }

  return (
    <Form.Item
      name={name}
      label={label}
      valuePropName="fileList"
      getValueFromEvent={normFile}
      rules={[{ required: required }]}
    >
      <Upload
        // action={serverURL + "/upload"}
        beforeUpload={beforeUpload}
        onRemove={onRemove}
        // onPreview={() => {}}
        onChange={handleUpload}
        fileList={fileList}
        maxCount={1}
        multiple={false}
        listType="picture"
        disabled={disabled}
      >
        {error && "Error: " + error}
        {fileList.length < 1 && <Button> Upload</Button>}
      </Upload>
    </Form.Item>
  )
}

export default InputImage
