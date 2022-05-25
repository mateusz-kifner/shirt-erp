import { Group, InputWrapper } from "@mantine/core"
import { FC } from "react"
import { FileType } from "../../types/FileType"
import FileList from "../FileList"

interface InputFileProps {
  label?: string
  value?: FileType | null
  onChange?: (value: FileType | null) => void
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
      <Group>
        <FileList
          onChange={(files) => {
            console.log(files)
            files && onChange && onChange(files[0])
          }}
          value={value ? [value] : null}
          disabled={disabled}
          maxFileCount={1}
        />
      </Group>
    </InputWrapper>
  )
}

export default InputFile
