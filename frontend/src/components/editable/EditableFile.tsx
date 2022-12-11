import { CSSObject, Input } from "@mantine/core"
import { useClipboard } from "@mantine/hooks"
import { CSSProperties } from "react"
import EditableInput from "../../types/EditableInput"
import { FileType } from "../../types/FileType"

interface EditableColorProps extends EditableInput<FileType> {
  style?: CSSProperties
}

const EditableFile = (props: EditableColorProps) => {
  const { label, value, initialValue, onSubmit, disabled, required, style } =
    props

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
    >
      <div></div>
    </Input.Wrapper>
  )
}

export default EditableFile
