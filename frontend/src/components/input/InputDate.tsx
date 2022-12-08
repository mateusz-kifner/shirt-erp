import { Popover, Portal } from "@mantine/core"
import { useClipboard, useDebouncedValue, useElementSize } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import dayjs from "dayjs"
import i18next from "i18next"
import Calendar from "react-calendar"
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { Copy } from "tabler-icons-react"
import i18n, { useTranslation } from "../../i18n"
import { handleFocusForInnerElements } from "../../utils/handleFocusForInnerElements"
import { handleBlurForInnerElements } from "../../utils/handleBlurForInnerElements"

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
  const { t } = useTranslation()
  const dateFormat = i18next.language === "pl" ? "DD.MM.YYYY" : "YYYY-MM-DD"
  const [opened, setOpened] = useState<boolean>(false)
  const [date, setDate] = useState<Date | null>(
    value ? new Date(value) : initialValue ? new Date(initialValue) : null
  )
  const [text, setText] = useState(dayjs(date).format("L").toString())

  const [debouncedText, cancel] = useDebouncedValue(text, 300)
  const { ref: leftSectionRef, width: leftSectionWidth } = useElementSize()
  const { ref: rightSectionRef, width: rightSectionWidth } = useElementSize()
  const textAreaRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const newDate = dayjs(debouncedText, dateFormat, i18next.language)
    if (
      newDate.toString() != "Invalid Date" &&
      newDate.format("YYYY-MM-DD").toString() !=
        dayjs(value).format("YYYY-MM-DD").toString()
    ) {
      onSubmit?.(newDate.format("YYYY-MM-DD").toString())
    }
  }, [debouncedText])

  useEffect(() => {}, [])

  return (
    <div
      className="relative flex-grow"
      onFocus={handleFocusForInnerElements(() => setOpened(true))}
      onBlur={handleBlurForInnerElements(() => setOpened(false))}
    >
      {opened && !disabled && (
        <Calendar
          className={"absolute top-full mt-2 left-0 z-[120] rounded"}
          onChange={(date: Date) => {
            setText(dayjs(date).format("L").toString())
          }}
          value={date}
        />
      )}
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
                  title: t("copy to clipboard"),
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
        id={"inputDate_" + uuid}
        ref={textAreaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={"w-full resize-none overflow-hidden display-cell"}
        readOnly={disabled}
        required={required}
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
