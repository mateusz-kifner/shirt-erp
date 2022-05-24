import { Group, InputWrapper } from "@mantine/core"
import { DatePicker, TimeInput } from "@mantine/dates"
import { FC, useState } from "react"

interface DetailsDateTime {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string | null) => void
  disabled?: boolean
  required?: boolean
}

const DetailsDateTime: FC<DetailsDateTime> = (props) => {
  const [date, setDate] = useState<Date>(
    props?.value ? new Date(props.value) : new Date()
  )
  let new_props = { ...props }
  delete new_props.label
  delete new_props.onChange
  delete new_props.value

  return (
    <InputWrapper label={props.label}>
      <Group grow>
        <DatePicker
          // {...new_props}
          placeholder={props.placeholder ? props.placeholder : "---"}
          onChange={(val) => {
            val && setDate(val)
          }}
          value={date}
        />
        <TimeInput
          // {...new_props}
          onChange={(val) => {
            val && setDate(val)
          }}
          value={date}
          styles={{
            timeInput: { opacity: 1 },
            input: { opacity: 1 },
            wrapper: { opacity: "1 !important" },
          }}
        />
      </Group>
    </InputWrapper>
  )
}

export default DetailsDateTime
