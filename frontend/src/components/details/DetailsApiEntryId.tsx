import { CSSObject } from "@mantine/core"
import { CSSProperties, FC } from "react"
import useStrapi from "../../hooks/useStrapi"
import DetailsApiEntry from "./DetailsApiEntry"

interface DetailsApiEntryIdProps {
  label?: string
  value?: any
  initialValue?: any
  onSubmit?: (value: any | null) => void
  disabled?: boolean
  required?: boolean
  entryName: string
  Element: React.ElementType
  copyProvider?: (value: any | null) => string | undefined
  style?: CSSProperties
  styles?: Partial<
    Record<"label" | "required" | "root" | "error" | "description", CSSObject>
  >
  withErase?: boolean
}

const DetailsApiEntryId: FC<DetailsApiEntryIdProps> = (props) => {
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
    styles,
    style,
    withErase = true,
  } = props

  const { data } = useStrapi(entryName, value?.id ? value.id : null)
  // const data = null
  return (
    <DetailsApiEntry
      {...props}
      onSubmit={(value) => onSubmit && onSubmit(value.id)}
      value={value?.id ? data : null}
    />
  )
}

export default DetailsApiEntryId
