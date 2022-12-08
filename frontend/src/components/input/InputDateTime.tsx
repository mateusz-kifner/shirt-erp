import dayjs from "dayjs"
import React from "react"
import { Calendar, Clock } from "tabler-icons-react"
import DisplayCell from "../basic/DisplayCell"

// TODO: make it work

interface InputDateTimeProps {
  label?: string
  value?: string
  initialValue?: Date
  onSubmit?: (value: Date | null) => void
  disabled?: boolean
  required?: boolean
}

const InputDateTime = (props: InputDateTimeProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    ...moreProps
  } = props
  return (
    <DisplayCell label={label} disabled={true}>
      <div className="flex gap-1">
        <Calendar color="#adb5bd" size={18} />
        {value ? dayjs(value).format("L").toString() : "⸺"}
        <Clock color="#adb5bd" size={18} style={{ marginLeft: 16 }} />
        {value ? dayjs(value).format("LT").toString() : "⸺"}
      </div>
    </DisplayCell>
  )
}

export default InputDateTime
