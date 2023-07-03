import { ActionIcon, ColorInput, Group, Input, Text } from "@mantine/core"
import { useClickOutside, useClipboard, useHover } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useEffect, useState, CSSProperties, useMemo } from "react"
import preventLeave from "../../utils/preventLeave"
import { IconCopy, IconX } from "@tabler/icons-react"
import { SxBorder, SxRadius } from "../../styles/basic"
import colorNames from "../../models/color-names.json"
import EditableInput from "../../types/EditableInput"

const colorNameKeys = Object.keys(colorNames)
const colorNamesRGB = colorNameKeys.map((val) => [
  parseInt(val.substring(1, 3), 16),
  parseInt(val.substring(3, 5), 16),
  parseInt(val.substring(5, 7), 16),
])

export const getColorNameFromHex = (hex: string) => {
  let name = "Nieznany"
  if (colorNames[hex as keyof typeof colorNames] !== undefined) {
    name = colorNames[hex as keyof typeof colorNames]
  } else {
    let min = 100000.0
    let min_index = -1

    const hex_r = parseInt(hex.substring(1, 3), 16)
    const hex_g = parseInt(hex.substring(3, 5), 16)
    const hex_b = parseInt(hex.substring(5, 7), 16)

    colorNamesRGB.forEach(([val_r, val_g, val_b], index) => {
      const weight = Math.sqrt(
        (val_r - hex_r) * (val_r - hex_r) +
          (val_g - hex_g) * (val_g - hex_g) +
          (val_b - hex_b) * (val_b - hex_b)
      )
      if (min > weight) {
        min = weight
        min_index = index
      }
    })

    if (min_index !== -1) {
      name =
        colorNames[colorNameKeys[min_index] as keyof typeof colorNames] + "*"
    }
  }
  return name
}

function convertTo6DigitColorCode(color: string) {
  let hex = ""
  if (color.length === 3 && color[0] !== "#") {
    hex = "#" + color[0] + color[0] + color[1] + color[1] + color[2] + color[2]
  }
  if (color.length === 4 && color[0] === "#") {
    hex = "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
  }
  if (color.length === 6 && color[0] !== "#") {
    hex = "#" + color
  }
  if (color.length === 7 && color[0] === "#") {
    hex = color
  }
  return hex
}

interface EditableColorProps extends EditableInput<string> {
  style?: CSSProperties
}

const EditableColor = (props: EditableColorProps) => {
  const { label, value, initialValue, onSubmit, disabled, required, style } =
    props
  const [color, setColor] = useState<string | null>(
    value ?? initialValue ?? null
  )
  const [focus, setFocus] = useState<boolean>(false)
  const ref = useClickOutside(() => setFocus(false))
  const clipboard = useClipboard()
  const { hovered, ref: refHover } = useHover()

  const colorName = useMemo(
    () => (color !== null ? getColorNameFromHex(color) : ""),
    [color]
  )

  useEffect(() => {
    if (focus) {
      window.addEventListener("beforeunload", preventLeave)
    } else {
      if (color !== value) {
        if (!color || color === null) {
          onSubmit?.(null)
          setColor(null)
          return
        }
        let hex = convertTo6DigitColorCode(color)
        if (!isNaN(parseInt(hex.substring(1), 16))) {
          onSubmit?.(hex)
          setColor(hex)
        }
      }
      window.removeEventListener("beforeunload", preventLeave)
    }
    // eslint-disable-next-line
  }, [focus])

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", preventLeave)
    }
  }, [])

  useEffect(() => {
    if (value) {
      setColor(value)
    } else {
      setColor("")
    }
  }, [value])

  const onKeyDown = (e: React.KeyboardEvent<any>) => {
    if (focus) {
      if (e.code == "Enter" || e.code == "Escape") {
        setFocus(false)
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
            {color && color.length > 0 && (
              <ActionIcon
                size="xs"
                style={{
                  display: "inline-block",
                  transform: "translate(4px, 4px)",
                }}
                onClick={() => {
                  clipboard.copy(color)
                  showNotification({
                    title: "Skopiowano do schowka",
                    message: color,
                  })
                }}
                tabIndex={-1}
              >
                <IconCopy size={16} />
              </ActionIcon>
            )}
          </>
        ) : undefined
      }
      labelElement="div"
      required={required}
      style={style}
      ref={refHover}
      onClick={() => setFocus(true)}
      onFocus={() => setFocus(true)}
    >
      <div ref={ref} style={{ position: "relative" }}>
        {focus ? (
          <ColorInput
            swatchesPerRow={7}
            format="hex"
            swatches={[
              "#000e1c",
              "#ce102c",
              "#002a3a",
              "#194E90",
              "#7E7B50",
              "#007398",
              "#AC9768",
              "#3B8DDF",
              "#DB5204",
              "#294634",
              "#845D32",
              "#512B3A",
              "#5D3225",
              "#A8353A",
              "#343E48",
              "#B42574",
              "#303030",
              "#D0E1D9",
              "#018657",
              "#4F4A34",
              "#77BC21",
              "#D5BA8D",
              "#C3A0D8",
              "#F0E87D",
              "#FF681F",
              "#FFA401",
              "#F8DBE0",
              "#ECED6E",
              "#2F1A45",
              "#AF0061",
              "#E2B87E",
              "#97D5EA",
              "#FFCD0E",
              "#FF8041",
              "#00A6B6",
              "#F52837",
              "#888A8E",
              "#F54D80",
              "#42201F",
              "#F6DC6D",
              "#FFBFA1",
              "#FFB1C1",
              "#BADCE6",
              "#FFB81E",
              "#96E3C1",
              "#c19473",
              "#426D8C",
              "#555555",
              "#ffffff",
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
            value={color ?? "#ffffff"}
            onChange={(new_hex) => {
              setColor(new_hex)
            }}
            disabled={disabled}
            required={required}
            styles={{ input: { minHeight: 44 } }}
            withinPortal={false}
            onKeyDown={onKeyDown}
            withPicker={true}
          />
        ) : (
          <Text
            sx={[
              SxBorder,
              (theme) => ({
                width: "100%",

                fontSize: theme.fontSizes.sm,
                wordBreak: "break-word",
                whiteSpace: "pre-line",
                padding: "10px 16px",
                paddingRight: 32,
                minHeight: 44,
                lineHeight: 1.55,
                paddingLeft: 36,
                "&:before": {
                  content: "''",
                  position: "absolute",
                  height: 24,
                  width: 24,
                  top: 9,
                  left: 6,
                  backgroundColor: color ?? undefined,
                  borderRadius: "100%",
                  border:
                    theme.colorScheme === "dark"
                      ? "1px solid #2C2E33"
                      : "1px solid #ced4da",
                },
                border:
                  focus || hovered
                    ? theme.colorScheme === "dark"
                      ? "1px solid #2C2E33"
                      : "1px solid #ced4da"
                    : "1px solid transparent",
                borderColor: colorName === "Nieznany" ? "#f00" : undefined,

                "&:focus": {
                  borderColor: focus
                    ? undefined
                    : theme.colorScheme === "dark"
                    ? theme.colors.dark[5]
                    : theme.colors.gray[4],
                },
              }),
              SxRadius,
            ]}
          >
            {colorName || "⸺"}
          </Text>
        )}
      </div>
    </Input.Wrapper>
  )
}

export default EditableColor
