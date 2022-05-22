import {
  ActionIcon,
  Center,
  Group,
  InputWrapper,
  Paper,
  Popper,
  Text,
  Textarea,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core"
import { useClickOutside, useClipboard } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { FC, RefObject, useEffect, useRef, useState } from "react"
import { ArrowBack, ArrowForward, Copy, Edit } from "tabler-icons-react"
import useStateWithHistory from "../../hooks/useStateWithHistory"

const alertUser = (e: BeforeUnloadEvent) => {
  e.preventDefault()
  e.returnValue = true
}

interface DetailsTextProps {
  label?: string
  value?: string
  initialValue?: string
  onChange?: (value: string | null) => void
  onSubmit?: (value: string | null) => void
  disabled?: boolean
  required?: boolean
}

const DetailsText: FC<DetailsTextProps> = ({
  label,
  value,
  initialValue,
  onChange,
  onSubmit,
  disabled,
  required,
}) => {
  const theme = useMantineTheme()
  const [val, setVal] = useState(
    value ? value : initialValue ? initialValue : ""
  )
  const [valHistory, setValHistory, { back, forward, history, pointer }] =
    useStateWithHistory(val, { capacity: 2 })
  const [active, setActive] = useState<boolean>(false)

  const activate = () => {
    setActive(true)
    window.addEventListener("beforeunload", alertUser)
  }

  const deactivate = () => {
    setActive(false)
    if (val !== value) {
      onSubmit && onSubmit(val)
      setValHistory(val)
    }
    window.removeEventListener("beforeunload", alertUser)
  }
  const clipboard = useClipboard()

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", alertUser)
    }
  }, [])

  useEffect(() => {
    if (value) {
      setVal(value)
      setValHistory(value)
    }
  }, [value])

  const onChangeTextarea = (e: React.ChangeEvent<any>) => {
    setVal(e.target.value)
    onChange && onChange(e.target.value)
  }

  const onKeyDownTextarea = (e: React.KeyboardEvent<any>) => {
    if (e.code == "Enter" && !e.shiftKey) {
      deactivate()
    }
    if (e.code == "Escape") {
      setActive(false)
      if (val !== value) {
        setValHistory(val)
      }
      window.removeEventListener("beforeunload", alertUser)
      back()
      setVal(valHistory)
    }
  }

  const onFocusTextarea = (e: React.FocusEvent<any, Element>) => {
    e.target.selectionStart = e.target.value.length
  }

  const handleBlur = (e: React.FocusEvent<any, Element>) => {
    const currentTarget = e.currentTarget

    // Check the newly focused element in the next tick of the event loop
    setTimeout(() => {
      // Check if the new activeElement is a child of the original container
      if (!currentTarget.contains(document.activeElement)) {
        // You can invoke a callback or add custom logic here
        deactivate()
      }
    }, 0)
  }
  return (
    <InputWrapper
      label={
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
              clipboard.copy(val)
              showNotification({
                title: "Skopiowano do schowka",
                message: val,
              })
            }}
            tabIndex={-1}
          >
            <Copy size={16} />
          </ActionIcon>
        </>
      }
      labelElement="div"
      required={required}
      // style={{ position: "relative" }}
    >
      {active ? (
        <div
          style={{ position: "relative" }}
          // onBlur={handleBlur}
        >
          <Textarea
            autosize
            autoFocus
            minRows={1}
            value={val}
            onChange={onChangeTextarea}
            onKeyDown={onKeyDownTextarea}
            onFocus={onFocusTextarea}
            onBlur={deactivate}
          />
          {/* history component
          {(pointer > 0 || pointer < history.length - 1) && (
            <Paper
              sx={{
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[5]
                    : theme.colors.gray[1],
                position: "absolute",
                bottom: -58,
                left: 0,
                zIndex: 1000,
                "&::before": {
                  content: "''",
                  position: "absolute",
                  height: 8,
                  width: 8,
                  top: -4,
                  left: 16,
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[5]
                      : theme.colors.gray[1],
                  borderRadius: 1,
                  transform: "rotate(45deg)",
                },
              }}
            >
              {pointer > 0 && (
                <Tooltip
                  label="Cofnij"
                  position="bottom"
                  openDelay={1000}
                  withArrow
                >
                  <UnstyledButton
                    p="sm"
                    sx={{
                      "&:hover::before": {
                        content: "''",
                        position: "absolute",
                        height: 32,
                        width: 32,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        borderRadius: theme.radius.md,
                      },
                    }}
                    onClick={() => {
                      back()
                      setVal(valHistory)
                    }}
                  >
                    <ArrowBack />
                  </UnstyledButton>
                </Tooltip>
              )}
              {pointer < history.length - 1 && (
                <Tooltip
                  label="Przywróć"
                  position="bottom"
                  openDelay={1000}
                  withArrow
                >
                  <UnstyledButton
                    p="sm"
                    sx={{
                      "&:hover::before": {
                        content: "''",
                        position: "absolute",
                        height: 32,
                        width: 32,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        borderRadius: theme.radius.md,
                      },
                    }}
                    onClick={() => {
                      forward()
                      setVal(valHistory)
                    }}
                  >
                    <ArrowForward />
                  </UnstyledButton>
                </Tooltip>
              )}
            </Paper>
          )} */}
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <Text
            sx={(theme) => ({
              width: "100%",
              border:
                theme.colorScheme === "dark"
                  ? "1px solid #2C2E33"
                  : "1px solid #ced4da",
              borderRadius: theme.radius.sm,
              padding: "1px 12px",
              fontSize: theme.fontSizes.sm,
              minHeight: 36,
              lineHeight: "34px",
              paddingRight: 28,
              wordBreak: "break-word",
              whiteSpace: "pre-line",
            })}
          >
            {val ? val : "⸺"}
          </Text>
          <ActionIcon
            radius="xl"
            style={{ position: "absolute", right: 4, top: 4 }}
            onClick={activate}
            disabled={disabled}
          >
            <Edit />
          </ActionIcon>
        </div>
      )}
    </InputWrapper>
  )
}

export default DetailsText
