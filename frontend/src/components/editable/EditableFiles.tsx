import { Input } from "@mantine/core"
import EditableInput from "../../types/EditableInput"
import { FileType } from "../../types/FileType"
import FileList from "../FileList"

interface EditableFilesProps extends EditableInput<FileType[]> {
  maxCount?: number
}

const EditableFiles = (props: EditableFilesProps) => {
  const { label, value, initialValue, onSubmit, disabled, required, maxCount } =
    props
  return (
    <Input.Wrapper
      label={label && label.length > 0 ? label : undefined}
      required={required}
    >
      <FileList
        value={value}
        initialValue={initialValue}
        onChange={(files) => {
          onSubmit && onSubmit(files)
        }}
        maxFileCount={maxCount}
        disabled={disabled}
      />
    </Input.Wrapper>
  )
}

export default EditableFiles
