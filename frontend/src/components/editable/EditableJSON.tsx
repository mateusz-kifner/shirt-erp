import { Input } from "@mantine/core"

interface EditableJSONProps {
  label?: string
  value?: string
  initialValue?: Date
  onSubmit?: (value: Date | null) => void
  disabled?: boolean
  required?: boolean
}

const EditableJSON = ({ value, label }: EditableJSONProps) => {
  return (
    <Input.Wrapper
      label={label && label.length > 0 ? label : undefined}
      labelElement="div"
    >
      <code
        style={{
          overflow: "hidden",
          maxWidth: "100%",
          padding: "0",
          boxSizing: "border-box",
          whiteSpace: "pre",
        }}
      >
        {JSON.stringify(value, null, 2)}
      </code>
    </Input.Wrapper>
  )
}

export default EditableJSON
