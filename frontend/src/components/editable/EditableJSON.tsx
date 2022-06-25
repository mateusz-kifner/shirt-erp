import { InputWrapper } from "@mantine/core"
import { Prism } from "@mantine/prism"
import { FC } from "react"

interface EditableJSONProps {
  label?: string
  value?: string
  initialValue?: Date
  onSubmit?: (value: Date | null) => void
  disabled?: boolean
  required?: boolean
}

const EditableJSON: FC<EditableJSONProps> = ({ value, label }) => {
  return (
    <InputWrapper
      label={label && label.length > 0 ? label : undefined}
      labelElement="div"
    >
      <Prism language="json">{JSON.stringify(value, null, 2)}</Prism>
    </InputWrapper>
  )
}

export default EditableJSON
