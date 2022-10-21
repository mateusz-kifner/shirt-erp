import {
  ActionIcon,
  ColorInput,
  Group,
  Input,
  Text,
  CSSObject,
} from "@mantine/core"
import { useClickOutside, useClipboard, useHover } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { FC, useEffect, useState, CSSProperties, useMemo } from "react"
import preventLeave from "../../utils/preventLeave"
import { ColorSwatch, Copy, Edit } from "tabler-icons-react"
import { SxBorder, SxRadius } from "../../styles/basic"
import colorNames from "../../models/color-names.json"

const colorNameKeys = Object.keys(colorNames)
const colorNamesRGB = colorNameKeys.map((val) => [
  parseInt(val.substring(1, 3), 16),
  parseInt(val.substring(3, 5), 16),
  parseInt(val.substring(5, 7), 16),
])

const getColorNameFromHex = (hex: string) => {
  let name = "Nieznany"
  if (colorNames[hex as keyof typeof colorNames] !== undefined) {
    name = colorNames[hex as keyof typeof colorNames]
  } else {
    const newColorNames = colorNameKeys.filter(
      (val) =>
        (val[1] === hex[1] && val[2] === hex[2]) ||
        (val[3] === hex[3] && val[4] === hex[4]) ||
        (val[5] === hex[5] && val[6] === hex[6])
    )
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

interface EditableColorProps {
  label?: string
  value?: string
  initialValue?: string
  onSubmit?: (value: string | null) => void
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
  const [color, setColor] = useState<string>(value ?? initialValue ?? "#ffffff")
  const [prevColor, setPrevColor] = useState(color)
  const [active, setActive] = useState<boolean>(false)
  const ref = useClickOutside(() => setActive(false))
  const clipboard = useClipboard()
  const { hovered, ref: refHover } = useHover()

  const colorName = useMemo(() => getColorNameFromHex(color), [color])

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
              value={color}
              onChange={(new_hex) => {
                setColor(new_hex)
              }}
              disabled={disabled}
              required={required}
              styles={{ input: { minHeight: 44 } }}
              withinPortal={false}
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
                    backgroundColor: color ?? undefined,
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
              {colorName}
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
