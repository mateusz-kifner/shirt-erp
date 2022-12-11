import { CSSObject } from "@mantine/core"
import { CSSProperties } from "react"
import useStrapi from "../../hooks/useStrapi"
import EditableInput from "../../types/EditableInput"
import EditableApiEntry from "./EditableApiEntry"

interface EditableApiEntryIdProps extends EditableInput<number> {
  entryName: string
  Element: React.ElementType
  copyProvider?: (value: any | null) => string | undefined
  style?: CSSProperties
  withErase?: boolean
}

const EditableApiEntryId = (props: EditableApiEntryIdProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    Element,
    entryName,
    copyProvider = () => "",
    style,
    withErase = false,
  } = props

  const { data } = useStrapi(entryName, value ? value : null)
  return (
    <EditableApiEntry
      {...props}
      onSubmit={(value) => onSubmit && onSubmit(value.id)}
      value={value ? data : null}
    />
  )
}

export default EditableApiEntryId
