import { FC, useEffect, useState } from "react"
import { Button } from "antd"
import { RGBColor, SketchPicker } from "react-color"

import tinycolor from "tinycolor2"

import styles from "./ColorPickerButton.module.css"

interface ColorPickerButtonProps {
  value: RGBColor
  onChange?: (color: RGBColor) => void
  disabled?: boolean
  showText?: boolean
}

const ColorPickerButton: FC<ColorPickerButtonProps> = ({
  value,
  onChange,
  disabled,
  showText,
}) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const [color, setColor] = useState<RGBColor>({ r: 0, g: 0, b: 0 })

  useEffect(() => {
    setColor(value)
  }, [value])

  const handleClick = () => {
    setDisplayColorPicker((val) => !val)
  }

  const handleClose = () => {
    setDisplayColorPicker(false)
  }
  const colorHex = "#" + tinycolor(color).toHex()
  return (
    <div style={{ position: "relative" }}>
      <Button
        disabled={disabled}
        onClick={handleClick}
        style={{
          backgroundColor:
            "rgb(" + color.r + "," + color.g + "," + color.b + ")",
          width: showText ? "5.5rem" : "auto",
        }}
      >
        {showText ? (
          <span
            style={{
              textAlign: "center",
              filter: "invert(100%)",
              color: colorHex,
            }}
          >
            {"#" + tinycolor(color).toHex().toUpperCase()}
          </span>
        ) : (
          " "
        )}
      </Button>
      {displayColorPicker && !disabled ? (
        <div className={styles.popover}>
          <div onClick={handleClose} className={styles.cover} />
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: "0",
              marginRight: "-2rem",
              marginTop: "0.25rem",
            }}
          >
            <SketchPicker
              color={color}
              onChange={(color) => {
                setColor(color.rgb)
                onChange && onChange(color.rgb)
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ColorPickerButton
