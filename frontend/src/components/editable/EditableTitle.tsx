import {
  ActionIcon,
  Group,
  Input,
  Paper,
  Popover,
  Portal,
  Textarea,
  Tooltip,
} from "@mantine/core"
import {
  useClickOutside,
  useClipboard,
  useHover,
  useMergedRef,
} from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { CSSProperties, useEffect, useRef, useState } from "react"
import { ArrowBackUp, ArrowForwardUp, Copy, Edit } from "tabler-icons-react"
import EditableInput from "../../types/EditableInput"
import { useTranslation } from "../../i18n"
import useHistoryState from "../../hooks/useHistoryState"
import { merge } from "lodash"

interface EditableTextProps extends EditableInput<string> {
  maxLength?: number
  style?: CSSProperties
}

const EditableText = (props: EditableTextProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    active,
    leftSection,
    rightSection,
    maxLength,
    style,
  } = props
  const clipboard = useClipboard()
  const { t } = useTranslation()
  const [mode, setMode] = useState<"edit" | "view" | "lock">("lock")

  const {
    state: text,
    set: setText,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
  } = useHistoryState<string>(value ?? initialValue ?? "")
  const textRef = useRef<HTMLTextAreaElement>(null)

  const clickOutsideRef = useClickOutside(() => {})
  const { hovered, ref } = useHover()
  const { hovered: hovered2, ref: hoveredRef2 } = useHover<HTMLButtonElement>()
  const wrapperRef = useMergedRef(clickOutsideRef, ref)

  useEffect(() => {
    setMode(active ? "view" : "lock")
  }, [active])

  const onChangeTextarea = (e: React.ChangeEvent<any>) => {
    setText(e.target.value)
  }

  const onKeyDownTextarea = (e: React.KeyboardEvent<any>) => {
    if (active) {
      if (e.code == "Enter" && !e.shiftKey) {
        // setActive(false)
        e.preventDefault()
      }
      if (e.code == "Escape") {
        // setActive(false)
        e.preventDefault()
      }
    } else {
      if (e.code == "Enter") {
        // !disabled && setActive(true)
        e.preventDefault()
      }
    }
  }

  return (
    <Input.Wrapper
      //   label={
      //     label && label.length > 0 ? (
      //       <>
      //         {label}
      //         {text.length > 0 && (
      //           <ActionIcon
      //             size="xs"
      //             style={{
      //               display: "inline-block",
      //               transform: "translate(4px, 4px)",
      //               marginRight: 4,
      //             }}
      //             onClick={() => {
      //               clipboard.copy(text)
      //               showNotification({
      //                 title: "Skopiowano do schowka",
      //                 message: text,
      //               })
      //             }}
      //             tabIndex={-1}
      //           >
      //             <Copy size={16} />
      //           </ActionIcon>
      //         )}
      //       </>
      //     ) : undefined
      //   }
      labelElement="div"
      required={required}
      style={merge(style, {})}
      ref={wrapperRef}
    >
      <div style={{ position: "relative", display: "flex", gap: "0.5rem" }}>
        <Textarea
          ref={textRef}
          autosize
          autoFocus
          minRows={1}
          value={text}
          onChange={onChangeTextarea}
          onKeyDown={onKeyDownTextarea}
          // onBlur={() => setActive(false)}
          readOnly={mode !== "edit"}
          maxLength={maxLength ?? 255}
          styles={(theme) => ({
            root: {
              flexGrow: 1,
            },
            input: {
              fontSize: "1.4em",
            },
          })}
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
          variant="unstyled"
        />

        {mode === "view" && (
          <ActionIcon
            radius="xl"
            onClick={() => setMode("edit")}
            disabled={disabled}
            tabIndex={-1}
          >
            <Edit size={18} />
          </ActionIcon>
        )}
        {mode === "edit" && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              zIndex: 1,
            }}
          >
            <Paper withBorder>
              <Group p="xs">
                <ActionIcon>
                  <ArrowBackUp />
                </ActionIcon>
                <ActionIcon>
                  <ArrowForwardUp />
                </ActionIcon>
              </Group>
            </Paper>
          </div>
        )}
      </div>
    </Input.Wrapper>
  )
}

export default EditableText
