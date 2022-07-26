import { ActionIcon, CSSObject, Input, TextInput } from "@mantine/core"
import { useClickOutside, useClipboard } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { FC, useEffect, useState, CSSProperties, ReactNode } from "react"
import preventLeave from "../../utils/preventLeave"
import { Copy, Edit, X } from "tabler-icons-react"

interface EditableNumberProps {
  label?: string
  value?: number
  initialValue?: number
  onSubmit?: (value: number | null) => void
  disabled?: boolean
  required?: boolean
  maxLength?: number
  style?: CSSProperties
  styles?: Partial<
    Record<"label" | "required" | "root" | "error" | "description", CSSObject>
  >
  rightSection: ReactNode
}

const EditableNumber: FC<EditableNumberProps> = (props) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    maxLength,
    style,
    styles,
    rightSection,
  } = props
  const [text, setText] = useState(
    value ? value.toString() : initialValue ? initialValue.toString() : "0"
  )
  const number = parseFloat(text)
  const [prevNumber, setPrevNumber] = useState(number)
  const [active, setActive] = useState<boolean>(false)
  const clipboard = useClipboard()
  const numberRef = useClickOutside(() => setActive(false))

  useEffect(() => {
    if (active) {
      window.addEventListener("beforeunload", preventLeave)
      numberRef.current &&
        (numberRef.current.selectionStart = numberRef.current.value.length)
      numberRef.current && numberRef.current.focus()
    } else {
      if (number !== prevNumber) {
        setText((text) => parseFloat(text).toFixed(2).toString())
        onSubmit && onSubmit(number)
        setPrevNumber(number)
      }
      window.removeEventListener("beforeunload", preventLeave)
    }
  }, [active])

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", preventLeave)
    }
  }, [])

  useEffect(() => {
    const new_value = typeof value === "number" ? value : 0
    setText(new_value.toFixed(2).toString())
    setPrevNumber(new_value)
  }, [value])

  const onChangeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const onKeyDownNumber = (e: React.KeyboardEvent<any>) => {
    // console.log(e)
    if (active) {
      if (e.code == "Enter" && !e.shiftKey) {
        setActive(false)
        e.preventDefault()
      }
      if (e.code == "Escape") {
        setText(prevNumber.toString())
        setActive(false)
        e.preventDefault()
      }
    } else {
      if (e.code == "Enter") {
        !disabled && setActive(true)
        e.preventDefault()
      }
    }
  }

  return (
    <Input.Wrapper
      label={
        label && label.length > 0 ? (
          <>
            {label}
            <ActionIcon
              size="xs"
              style={{
                display: "inline-block",
                transform: "translate(4px, 4px)",
                marginRight: 4,
              }}
              onClick={() => {
                clipboard.copy(number)
                showNotification({
                  title: "Skopiowano do schowka",
                  message: number,
                })
              }}
              tabIndex={-1}
            >
              <Copy size={16} />
            </ActionIcon>
          </>
        ) : undefined
      }
      labelElement="div"
      required={required}
      style={style}
      styles={styles}
    >
      <div style={{ position: "relative" }}>
        <TextInput
          ref={numberRef}
          autoFocus
          value={text}
          onChange={onChangeNumber}
          onKeyDown={onKeyDownNumber}
          onBlur={() => setActive(false)}
          rightSection={rightSection}

          // readOnly={!active}
          // maxLength={maxLength ? maxLength : 255}
          // styles={(theme) => ({
          //   input: {
          //     paddingRight: 40,
          //     backgroundColor: active
          //       ? theme.colorScheme === "dark"
          //         ? theme.colors.dark[6]
          //         : theme.colors.gray[0]
          //       : "transparent",

          //     border:
          //       theme.colorScheme === "dark"
          //         ? "1px solid #2C2E33"
          //         : "1px solid #ced4da",
          //   },
          // })}
        />

        {!active ? (
          <ActionIcon
            radius="xl"
            style={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            onClick={() => setActive(true)}
            disabled={disabled}
            tabIndex={-1}
          >
            <Edit size={18} />
          </ActionIcon>
        ) : (
          <ActionIcon
            radius="xl"
            style={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            onClick={() => setActive(false)}
            disabled={disabled}
            tabIndex={-1}
          >
            <X size={18} />
          </ActionIcon>
        )}
      </div>
    </Input.Wrapper>
  )
}

export default EditableNumber
