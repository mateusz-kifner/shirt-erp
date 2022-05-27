import { InputWrapper } from "@mantine/core"
import { Prism } from "@mantine/prism"
import { FC } from "react"

interface DetailsJSONProps {
  label?: string
  value?: string
  initialValue?: Date
  onChange?: (value: Date | null) => void
  onSubmit?: (value: Date | null) => void
  disabled?: boolean
  required?: boolean
}

const DetailsJSON: FC<DetailsJSONProps> = ({ value, label }) => {
  return (
    <InputWrapper label={label} labelElement="div">
      <Prism language="json">{JSON.stringify(value, null, 2)}</Prism>
    </InputWrapper>
  )
}

export default DetailsJSON
