import React, { FC } from "react"
import useStrapi from "../../hooks/useStrapi"
import InputFile from "./InputFile"

interface InputFileIdProps {
  label?: string
  value?: number | null
  onChange?: (value: number | null) => void
  disabled?: boolean
  required?: boolean
}

const InputFileId: FC<InputFileIdProps> = ({
  label,
  required,
  onChange,
  value,
  disabled,
}) => {
  //TODO: make value work
  // const { data } = useStrapi("upload", value)
  // console.log(data)

  return (
    <InputFile
      label={label}
      required={required}
      disabled={disabled}
      onChange={(file) => file?.id && onChange && onChange(file?.id)}
      // value={data}
    />
  )
}

export default InputFileId
