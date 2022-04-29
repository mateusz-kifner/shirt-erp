import { Group, InputWrapper } from "@mantine/core"
import { FC } from "react"
import { FileType } from "../../types/FileType"
import FileList from "../FileList"

interface InputFilesProps {
  label?: string
  value?: FileType[] | null
  onChange?: (value: FileType[] | null) => void
  disabled?: boolean
  required?: boolean
}

const InputFiles: FC<InputFilesProps> = ({
  label,
  value,
  onChange,
  disabled,
  required,
}) => {
  return (
    <InputWrapper label={label} required={required}>
      <Group>
        <FileList onChange={onChange} value={value} disabled={disabled} />
      </Group>
    </InputWrapper>
  )
}

export default InputFiles
