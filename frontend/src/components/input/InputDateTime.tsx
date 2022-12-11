import { useClipboard } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import dayjs from "dayjs"
import React, { DetailedHTMLProps, InputHTMLAttributes } from "react"
import { Calendar, Clock, Copy } from "tabler-icons-react"
import EditableInput from "../../types/EditableInput"
import DisplayCell from "../basic/DisplayCell"

// TODO: make it work

interface InputDateTimeProps
  extends DetailedHTMLProps<
      Omit<InputHTMLAttributes<HTMLInputElement>, "onSubmit" | "value">,
      HTMLInputElement
    >,
    EditableInput<string> {}

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
  const clipboard = useClipboard()

  return (
    <DisplayCell
      label={
        <>
          {" "}
          {label}{" "}
          {dayjs(value).format("L LT").toString().length > 0 && (
            <button
              className="btn btn-square p-[2px] mr-1"
              onClick={() => {
                clipboard.copy(dayjs(value).format("L LT").toString())
                showNotification({
                  title: "Skopiowano do schowka",
                  message: dayjs(value).format("L LT").toString(),
                })
              }}
              tabIndex={-1}
            >
              <Copy size={16} />
            </button>
          )}
        </>
      }
      disabled={true}
    >
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
