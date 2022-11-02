import { Input } from "@mantine/core"
import { useListState } from "@mantine/hooks"
import React from "react"
import { FileType } from "../../types/FileType"

interface EditableDesignProps {
  label?: string
  value?: any
  initialValue?: any
  onSubmit?: (value: any | null) => void
  disabled?: boolean
  required?: boolean
  files?: FileType[]
}

const EditableDesign = (props: EditableDesignProps) => {
  const { label, value, initialValue, onSubmit, disabled, required, files } =
    props

  const [images, imagesHandlers] = useListState<FileType>([])

  return (
    <Input.Wrapper label={label}>
      <div>Design editor</div>
      {images.map((imageData, index) => (
        <img src={imageData.url}></img>
      ))}
    </Input.Wrapper>
  )
}

export default EditableDesign
