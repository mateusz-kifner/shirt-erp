import { useClipboard, useDebouncedValue, useElementSize } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import dayjs from "dayjs"
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useId,
  useState,
} from "react"
import { Copy } from "tabler-icons-react"

interface InputDateProps
  extends DetailedHTMLProps<
    Omit<InputHTMLAttributes<HTMLInputElement>, "onSubmit">,
    HTMLInputElement
  > {
  label?: string
  value?: string
  initialValue?: string
  onSubmit?: (value: string | null) => void
  disabled?: boolean
  required?: boolean
  leftSection?: ReactNode
  rightSection?: ReactNode
}

const InputDate = (props: InputDateProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    leftSection,
    rightSection,
  } = props
  const uuid = useId()
  const clipboard = useClipboard()

  const [date, setDate] = useState<Date | null>(
    value ? new Date(value) : initialValue ? new Date(initialValue) : null
  )
  const [text, setText] = useState(date?.toString())

  const [debouncedDate, cancel] = useDebouncedValue(date, 1000)
  const { ref: leftSectionRef, width: leftSectionWidth } = useElementSize()
  const { ref: rightSectionRef, width: rightSectionWidth } = useElementSize()

  return (
    <div className="relative flex-grow">
      {label && (
        <label
          htmlFor={"inputDate_" + uuid}
          className="text-sm dark:text-gray-400"
        >
          {label}
          {date && (
            <button
              className="btn btn-square p-[2px] mr-1"
              onClick={() => {
                const dateString = dayjs(date).format("L").toString()
                clipboard.copy(dateString)
                showNotification({
                  title: "Skopiowano do schowka",
                  message: dateString,
                })
              }}
              tabIndex={-1}
            >
              <Copy size={16} />
            </button>
          )}
        </label>
      )}
      <div
        className="absolute top-1/2 left-1 -translate-y-1/2"
        ref={leftSectionRef}
      >
        {!!leftSection && leftSection}
      </div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={"w-full resize-none overflow-hidden display-cell"}
      />

      <div
        className="absolute top-1/2 right-1 -translate-y-1/2"
        ref={rightSectionRef}
      >
        {!!rightSection && rightSection}
      </div>
    </div>
  )
}

export default InputDate
