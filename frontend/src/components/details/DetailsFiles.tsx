import { InputWrapper } from "@mantine/core"
import React, { FC } from "react"
import { FileType } from "../../types/FileType"
import FileList from "../FileList"

interface DetailsFilesProps {
  label?: string
  value?: FileType[] | null
  initialValue?: FileType[] | null
  onSubmit?: (value: FileType[] | null) => void
  disabled?: boolean
  required?: boolean
  maxCount?: number
}

const DetailsFiles: FC<DetailsFilesProps> = (props) => {
  const {
    label,
    value,
    initialValue,

    onSubmit,
    disabled,
    required,
    maxCount,
  } = props
  return (
    <InputWrapper
      label={label && label.length > 0 ? label : undefined}
      required={required}
    >
      <FileList
        value={value}
        // initialValue={initialValue}
        onChange={(files) => {
          onSubmit && onSubmit(files)
        }}
        maxFileCount={maxCount}
        disabled={disabled}
      />
    </InputWrapper>
  )
}

export default DetailsFiles
