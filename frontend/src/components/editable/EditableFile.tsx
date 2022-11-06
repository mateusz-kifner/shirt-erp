import { CSSObject, Input } from "@mantine/core"
import { useClipboard } from "@mantine/hooks"
import { CSSProperties } from "react"
import { FileType } from "../../types/FileType"

interface EditableColorProps {
  label?: string
  value?: FileType
  initialValue?: FileType
  onSubmit?: (value: FileType | null) => void
  disabled?: boolean
  required?: boolean
  style?: CSSProperties
  styles?: Partial<
    Record<"label" | "required" | "root" | "error" | "description", CSSObject>
  >
}

const EditableFile = (props: EditableColorProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    style,
    styles,
  } = props

  const clipboard = useClipboard()

  return (
    <Input.Wrapper
      label={
        label
        // && label.length > 0 ? (
        //   <>
        //     {label}
        //     {text.length > 0 && (
        //       <ActionIcon
        //         size="xs"
        //         style={{
        //           display: "inline-block",
        //           transform: "translate(4px, 4px)",
        //           marginRight: 4,
        //         }}
        //         onClick={() => {
        //           clipboard.copy(text)
        //           showNotification({
        //             title: "Skopiowano do schowka",
        //             message: text,
        //           })
        //         }}
        //         tabIndex={-1}
        //       >
        //         <Copy size={16} />
        //       </ActionIcon>
        //     )}
        //   </>
        // ) : undefined
      }
      labelElement="div"
      required={required}
      style={style}
      styles={styles}
    >
      <div></div>
    </Input.Wrapper>
  )
}

export default EditableFile
