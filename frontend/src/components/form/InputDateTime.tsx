import { Group, InputWrapper } from "@mantine/core"
import { DatePicker, TimeInput } from "@mantine/dates"
import { FC, useState } from "react"

// FIXME: don't reset time after date change

interface InputDateTime {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string | null) => void
  disabled?: boolean
  required?: boolean
}

const InputDateTime: FC<InputDateTime> = (props) => {
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
          {...new_props}
          placeholder={props.placeholder ? props.placeholder : "---"}
          onChange={(val) => {
            val && setDate(val)
          }}
          value={date}
        />
        <TimeInput
          {...new_props}
          onChange={(val) => {
            val && setDate(val)
          }}
          value={date}
        />
      </Group>
    </InputWrapper>
  )
}

export default InputDateTime
