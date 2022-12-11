import { useClipboard, useDebouncedValue, useElementSize } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { Copy } from "tabler-icons-react"
import EditableInput from "../../types/EditableInput"
import preventLeave from "../../utils/preventLeave"

interface InputNumberProps
  extends DetailedHTMLProps<
      Omit<InputHTMLAttributes<HTMLInputElement>, "onSubmit" | "value">,
      HTMLInputElement
    >,
    EditableInput<number> {
  increment?: number
  fixed?: number
  min?: number
  max?: number
}

const InputNumber = (props: InputNumberProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    leftSection,
    rightSection,
    increment = 0.01,
    fixed = 2,
    min = Number.MIN_VALUE,
    max = Number.MAX_VALUE,
    ...moreProps
  } = props
  const uuid = useId()
  const clipboard = useClipboard()

  const [text, setText] = useState<string>(
    value?.toFixed(fixed) ?? initialValue?.toFixed(fixed) ?? ""
  )
  const [debouncedText, cancel] = useDebouncedValue(text, 1000)

  const { ref: leftSectionRef, width: leftSectionWidth } = useElementSize()
  const { ref: rightSectionRef, width: rightSectionWidth } = useElementSize()
  const inputNumberRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    if (value !== undefined && parseFloat(text) - value > 0.000001) {
      setText(value.toFixed(fixed))
    }
    // eslint-disable-next-line
  }, [value])

  useEffect(() => {
    // submit debouncedText
    const debouncedTextAsNumber = parseFloat(debouncedText.replace(",", "."))
    console.log(debouncedTextAsNumber)
    if (
      value === undefined ||
      (value !== undefined && debouncedTextAsNumber - value > 0.000001)
    ) {
      if (
        !isNaN(debouncedTextAsNumber) &&
        debouncedTextAsNumber > min &&
        debouncedTextAsNumber < max
      ) {
        debouncedText && onSubmit && onSubmit(debouncedTextAsNumber)
        setError(false)
      } else {
        setError(true)
      }
    }
    // eslint-disable-next-line
  }, [debouncedText])

  // useEffect(() => {
  //   return () => {
  //     // submit on leave
  //     if (text !== value) {
  //       onSubmit?.(text)
  //     }
  //     window.removeEventListener("beforeunload", preventLeave)
  //   }
  //   // eslint-disable-next-line
  // }, [])
  return (
    <div className="flex-grow">
      {label && (
        <label
          htmlFor={"textarea_" + uuid}
          className="text-sm dark:text-gray-400"
        >
          {label}{" "}
          {text !== null && (
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
        <input
          ref={inputNumberRef}
          type="number"
          className={`w-full resize-none overflow-hidden display-cell ${
            error ? "outline-red-600 dark:outline-red-600" : ""
          }`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            paddingLeft: `calc(${leftSectionWidth}px + 0.5rem)`,
            paddingRight: `calc(${rightSectionWidth}px + 0.5rem)`,
          }}
          onKeyDown={() => cancel()}
          {...moreProps}
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

export default InputNumber
