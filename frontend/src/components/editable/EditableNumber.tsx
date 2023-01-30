import { ActionIcon, Group, Input, Paper, TextInput, Box } from "@mantine/core"
import { useClipboard, useHover } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import React, { useEffect, useRef, useState } from "react"
import preventLeave from "../../utils/preventLeave"
import { ArrowBackUp, ArrowForwardUp, Copy } from "tabler-icons-react"
import EditableInput from "../../types/EditableInput"
import useDebouncedHistoryState from "../../hooks/useDebouncedHistoryState"
import { handleBlurForInnerElements } from "../../utils/handleBlurForInnerElements"

// FIXME: make DisplayCell accept icon as ReactNode

interface EditableNumberProps extends EditableInput<number> {
  increment?: number
  fixed?: number
  min?: number
  max?: number
}

const EditableNumber = (props: EditableNumberProps) => {
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
    increment = 0.01,
    fixed = 2,
    min = -100_000_000_000,
    max = 100_000_000_000,
  } = props
  const [error, setError] = useState<boolean>(false)
  const [text, setText, debouncedValue, { undo, redo, canUndo, canRedo }] =
    useDebouncedHistoryState<string>(
      value ? value.toString() : initialValue ? initialValue.toString() : "0.00"
    )
  const [focus, setFocus] = useState<boolean>(false)
  const clipboard = useClipboard()
  const numberRef = useRef<HTMLInputElement>(null)
  const { hovered, ref } = useHover()

  useEffect(() => {
    if (focus) {
      window.addEventListener("beforeunload", preventLeave)
    } else {
      window.removeEventListener("beforeunload", preventLeave)
    }
    // eslint-disable-next-line
  }, [focus])

  useEffect(() => {
    if (
      (value !== undefined ? parseFloat(value?.toFixed(fixed)) : 0) !==
        parseFloat(debouncedValue) &&
      !isNaN(parseFloat(debouncedValue))
    ) {
      if (parseFloat(debouncedValue) < min) {
        debouncedValue !== undefined && onSubmit?.(min)
        setText(min.toFixed(fixed))
        setError(true)
      } else if (parseFloat(debouncedValue) > max) {
        debouncedValue !== undefined && onSubmit?.(max)
        setText(max.toFixed(fixed))
        setError(true)
      } else {
        debouncedValue !== undefined &&
          onSubmit?.(parseFloat(parseFloat(debouncedValue).toFixed(2)))
        setError(false)
      }
    }
  }, [debouncedValue])

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", preventLeave)
    }
  }, [])

  useEffect(() => {
    const new_value =
      value && !isNaN(value) ? value.toFixed(fixed) : (0.0).toFixed(fixed)
    setText(new_value)
    // eslint-disable-next-line
  }, [value])

  const onKeyDownNumber = (e: React.KeyboardEvent<any>) => {
    if (active) {
      let multiplier = 1
      if (e.code === "Enter" || e.code === "Escape") {
        e.preventDefault()
        setFocus(false)
      }
      if (e.altKey) multiplier *= 0.1
      if (e.shiftKey) multiplier *= 10
      if (e.code === "ArrowUp") {
        e.preventDefault()
        setText((parseFloat(text) + increment * multiplier).toFixed(fixed))
      }
      if (e.code === "ArrowDown") {
        e.preventDefault()
        setText((parseFloat(text) - increment * multiplier).toFixed(fixed))
      }
    }
  }

  return (
    <Input.Wrapper
      label={
        label && label.length > 0 ? (
          <>
            {label}
            {text && text.length > 0 && (
              <ActionIcon
                size="xs"
                style={{
                  display: "inline-block",
                  transform: "translate(4px, 4px)",
                  marginRight: 4,
                }}
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
              </ActionIcon>
            )}
          </>
        ) : undefined
      }
      labelElement="div"
      required={required}
      style={{ position: "relative" }}
      ref={ref}
      onClick={() => setFocus(true)}
      onFocus={() => setFocus(true)}
      onBlur={handleBlurForInnerElements(() => setFocus(false))}
    >
      <TextInput
        readOnly={!(active && focus)}
        ref={numberRef}
        onChange={(e) => setText(e.target.value)}
        value={text}
        variant={active ? "filled" : "default"}
        styles={(theme) => ({
          input: {
            padding: "1px 16px",
            lineHeight: 1.55,
            height: 44,
            backgroundColor:
              active && focus
                ? theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0]
                : "transparent",
            border:
              (active && focus) || hovered
                ? theme.colorScheme === "dark"
                  ? "1px solid #2C2E33"
                  : "1px solid #ced4da"
                : "1px solid transparent",
            "&:focus": {
              borderColor:
                active && focus
                  ? error
                    ? "red"
                    : undefined
                  : theme.colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.gray[4],
            },
          },
          defaultVariant: {
            backgroundColor: active ? "initial" : "transparent",
          },
        })}
        autoFocus
        onKeyDown={onKeyDownNumber}
        icon={leftSection}
        rightSection={rightSection}
      />

      {active && focus && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 16,
            zIndex: 1,
          }}
        >
          <Box
            sx={(theme) => ({
              position: "absolute",
              top: -2,
              left: "50%",
              zIndex: 1,
              width: 8,
              height: 8,
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],

              border:
                theme.colorScheme === "dark"
                  ? `1px solid ${theme.colors.dark[4]}`
                  : `1px solid ${theme.colors.gray[0]}`,
              borderLeft: "none",
              borderBottom: "none",
              transformOrigin: "bottom left",
              transform: "rotate(-45deg)",
              borderRadius: 1,
            })}
          ></Box>
          <Paper
            withBorder
            radius="md"
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            })}
          >
            <Group p={4} spacing={4}>
              <ActionIcon
                onClick={() => undo()}
                radius="md"
                disabled={!canUndo}
              >
                <ArrowBackUp />
              </ActionIcon>

              <ActionIcon
                onClick={() => redo()}
                radius="md"
                disabled={!canRedo}
              >
                <ArrowForwardUp />
              </ActionIcon>
            </Group>
          </Paper>
        </div>
      )}
    </Input.Wrapper>
  )
}

export default EditableNumber
