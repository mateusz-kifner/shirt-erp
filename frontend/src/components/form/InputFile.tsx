import { InputWrapper } from "@mantine/core"
import { FC } from "react"
import { FileType } from "../../types/FileType"
import { StrapiEntryType } from "../../types/StrapiEntryType"
import FileButton from "../FileButton"

interface InputFileProps {
  label?: string
  placeholder?: string
  value?: StrapiEntryType<FileType> | null
  onChange?: (value: StrapiEntryType<FileType> | null) => void
  disabled?: boolean
  required?: boolean
}
const InputFile: FC<InputFileProps> = ({
  label,
  value,
  onChange,
  disabled,
  required,
}) => {
  return (
    <InputWrapper label={label} required={required}>
      <FileButton onChange={onChange} value={value} disabled={disabled} />
    </InputWrapper>
  )
}

export default InputFile
