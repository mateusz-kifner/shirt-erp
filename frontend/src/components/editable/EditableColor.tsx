import {
  ActionIcon,
  Box,
  ColorInput,
  Group,
  Input,
  TextInput,
  Text,
  CSSObject,
} from "@mantine/core"
import { useClickOutside, useClipboard, useHover } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { FC, useEffect, useState, useRef, CSSProperties } from "react"
import preventLeave from "../../utils/preventLeave"
import { ColorSwatch, Copy, Edit } from "tabler-icons-react"
import { ColorType } from "../../types/ColorType"
import { SxBorder, SxRadius } from "../../styles/basic"

interface EditableColorProps {
  label?: string
  value?: ColorType
  initialValue?: ColorType
  onSubmit?: (value: ColorType | null) => void
  disabled?: boolean
  required?: boolean
  style?: CSSProperties
  styles?: Partial<
    Record<"label" | "required" | "root" | "error" | "description", CSSObject>
  >
}

const EditableColor: FC<EditableColorProps> = (props) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    style,
    styles,
  } = props
  const [color, setColor] = useState<ColorType>(
    value ??
      initialValue ?? {
        name: "",
        hex: "#ffffff",
      }
  )
  const [prevColor, setPrevColor] = useState(color)
  const [active, setActive] = useState<boolean>(false)
  const ref = useClickOutside(() => setActive(false))
  const clipboard = useClipboard()
  const { hovered, ref: refHover } = useHover()

  // console.log(color)
  useEffect(() => {
    if (active) {
      window.addEventListener("beforeunload", preventLeave)
    } else {
      if (color !== value) {
        onSubmit && onSubmit(color)
        setPrevColor(color)
      }
      window.removeEventListener("beforeunload", preventLeave)
    }
    // eslint-disable-next-line
  }, [active])

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", preventLeave)
    }
  }, [])

  useEffect(() => {
    if (value) {
      setColor(value)
      setPrevColor(value)
    }
  }, [value])

  // const onChangeColorarea = (value: string) => {
  //   setColor(value)
  //   onChange && onChange(value)
  // }

  const onKeyDown = (e: React.KeyboardEvent<any>) => {
    if (active) {
      if (e.code == "Enter") {
        setActive(false)
        e.preventDefault()
      }
      if (e.code == "Escape") {
        setColor(prevColor)
        setActive(false)
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
            {color.hex && color.hex.length > 0 && (
              <ActionIcon
                size="xs"
                style={{
                  display: "inline-block",
                  transform: "translate(4px, 4px)",
                }}
                onClick={() => {
                  clipboard.copy(color.hex)
                  showNotification({
                    title: "Skopiowano do schowka",
                    message: color.hex,
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
      style={style}
      styles={styles}
      ref={refHover}
    >
      <div ref={ref} style={{ position: "relative" }}>
        {active ? (
          <Group grow>
            <ColorInput
              swatchesPerRow={7}
              format="hex"
              swatches={[
                "#25262b",
                "#868e96",
                "#fa5252",
                "#e64980",
                "#be4bdb",
                "#7950f2",
                "#4c6ef5",
                "#228be6",
                "#15aabf",
                "#12b886",
                "#40c057",
                "#82c91e",
                "#fab005",
                "#fd7e14",
              ]}
              value={color?.hex}
              onChange={(new_hex) => {
                setColor((old_color) => ({
                  ...old_color,
                  hex: new_hex,
                }))
              }}
              disabled={disabled}
              required={required}
              styles={{ input: { minHeight: 44 } }}
              withinPortal={false}
              onKeyDown={onKeyDown}
            />
            <TextInput
              value={color?.name}
              onChange={(e) => {
                setColor((old_color) => ({
                  ...old_color,
                  name: e.target.value,
                }))
              }}
              disabled={disabled}
              required={required}
              styles={{ input: { minHeight: 44 } }}
              onKeyDown={onKeyDown}
            />
          </Group>
        ) : (
          <>
            <Text
              sx={[
                (theme) => ({
                  width: "100%",

                  fontSize: theme.fontSizes.sm,
                  wordBreak: "break-word",
                  whiteSpace: "pre-line",
                  padding: "10px 16px",
                  paddingRight: 32,
                  minHeight: 36,
                  lineHeight: 1.55,
                  paddingLeft: 36,
                  "&:before": {
                    content: "''",
                    position: "absolute",
                    height: 24,
                    width: 24,
                    top: 9,
                    left: 6,
                    backgroundColor: color.hex ?? undefined,
                    borderRadius: "100%",
                    border:
                      theme.colorScheme === "dark"
                        ? "1px solid #2C2E33"
                        : "1px solid #ced4da",
                  },
                }),
                SxBorder,
                SxRadius,
              ]}
            >
              {/* <ColorSwatch
                color="#adb5bd"
                size={18}
                style={{
                  bottom: 13,
                  left: 9,
                  position: "absolute",
                }}
              /> */}
              {color.name ?? "⸺"}
            </Text>

            {hovered && (
              <ActionIcon
                radius="xl"
                style={{ position: "absolute", right: 8, top: 8 }}
                onClick={() => setActive(true)}
                disabled={disabled}
              >
                <Edit size={18} />
              </ActionIcon>
            )}
          </>
        )}
      </div>
    </Input.Wrapper>
  )
}

export default EditableColor
