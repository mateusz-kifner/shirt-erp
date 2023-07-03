import { Input } from "@mantine/core"
import EditableInput from "../../types/EditableInput"

interface EditableJSONProps extends EditableInput<string> {}

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
