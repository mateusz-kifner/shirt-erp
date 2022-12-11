import { useClipboard, useDebouncedValue, useElementSize } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import {
  DetailedHTMLProps,
  ReactNode,
  TextareaHTMLAttributes,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { Copy } from "tabler-icons-react"
import preventLeave from "../../utils/preventLeave"
import { truncString } from "../../utils/truncString"

interface InputTextProps
  extends DetailedHTMLProps<
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onSubmit">,
    HTMLTextAreaElement
  > {
  label?: string
  value?: string
  initialValue?: string
  onSubmit?: (value: string | null) => void
  disabled?: boolean
  required?: boolean
  maxLength?: number
  leftSection?: ReactNode
  rightSection?: ReactNode
}

const InputText = (props: InputTextProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    maxLength,
    leftSection,
    rightSection,
    ...moreProps
  } = props
  const uuid = useId()
  const clipboard = useClipboard()

  const [text, setText] = useState(value ?? initialValue ?? "")
  const [debouncedText, cancel] = useDebouncedValue(text, 1000)

  const { ref: leftSectionRef, width: leftSectionWidth } = useElementSize()
  const { ref: rightSectionRef, width: rightSectionWidth } = useElementSize()
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setText(value ?? "")
    textAreaRef.current && setTextAreaHeight(textAreaRef.current)
  }, [value])

  const setTextAreaHeight = (target: HTMLTextAreaElement) => {
    target.style.height = "0"
    target.style.height = target.scrollHeight + "px"
  }

  useEffect(() => {
    // submit debouncedText
    if (debouncedText !== value) {
      onSubmit?.(debouncedText)
    }
    // eslint-disable-next-line
  }, [debouncedText])

  useEffect(() => {
    return () => {
      // submit on leave
      if (text !== value) {
        onSubmit?.(text)
      }
      window.removeEventListener("beforeunload", preventLeave)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className="flex-grow">
      {label && (
        <label
          htmlFor={"textarea_" + uuid}
          className="text-sm dark:text-gray-400"
        >
          {label}{" "}
          {text.length > 0 && (
            <button
              className="btn btn-square p-[2px] mr-1"
              onClick={() => {
                clipboard.copy(text)
                showNotification({
                  title: "Skopiowano do schowka",
                  message: text,
                })
              }}
              tabIndex={-1}
            >
              <Copy size={16} />
            </button>
          )}
        </label>
      )}
      <div className="relative">
        <div
          className="absolute top-1/2 left-1 -translate-y-1/2"
          ref={leftSectionRef}
        >
          {!!leftSection && leftSection}
        </div>
        <textarea
          id={"textarea_" + uuid}
          required={required}
          readOnly={disabled}
          ref={textAreaRef}
          className={"w-full resize-none overflow-hidden display-cell"}
          style={{
            paddingLeft: `calc(${leftSectionWidth}px + 0.5rem)`,
            paddingRight: `calc(${rightSectionWidth}px + 0.5rem)`,
          }}
          {...moreProps}
          value={text}
          onFocus={() => window.addEventListener("beforeunload", preventLeave)}
          onBlur={() =>
            window.removeEventListener("beforeunload", preventLeave)
          }
          onChange={(e) => {
            if (!(maxLength && e.target.value.length > maxLength)) {
              setText(e.target.value)
              cancel()
            }
          }}
          onKeyDown={(e) => {
            console.log(e)
            if (e.key == "Enter" && !e.shiftKey) {
              ;(e.target as HTMLTextAreaElement).blur()
              e.preventDefault()
              return false
            }
          }}
          onInput={(e) => setTextAreaHeight(e.target as HTMLTextAreaElement)}
        />
        <div
          className="absolute top-1/2 right-1 -translate-y-1/2"
          ref={rightSectionRef}
        >
          {!!rightSection && rightSection}
        </div>
      </div>
    </div>
  )
}

export default InputText
