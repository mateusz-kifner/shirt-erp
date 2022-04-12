import { FC, useState } from "react"
import { Button, Input as InputAntd } from "antd"
import SketchPicker from "react-color/lib/components/sketch/Sketch"

import tinycolor from "tinycolor2"

import styles from "../ColorPickerButton.module.css"

export interface ColorResult {
  hex: string
  hsl: {
    a?: number | undefined
    h: number
    l: number
    s: number
  }
  rgb: {
    a?: number | undefined
    b: number
    g: number
    r: number
  }
}

interface OnChangeHandler {
  (e: any): void
}

interface InputColorProps {
  value: { colorName: string; colorHex: string }
  onChange: OnChangeHandler
  showText?: boolean
  disabled?: boolean
}

const color_list = [
  { color: "#D0021B", title: "Czerwony" },
  { color: "#F5A623", title: "Pomarańczowy" },
  { color: "#F8E71C", title: "Żółty" },
  { color: "#8B572A", title: "Brązowy" },
  { color: "#7ED321", title: "Zielony jasny" },
  { color: "#417505", title: "Zielony ciemny" },
  { color: "#BD10E0", title: "Różowy" },
  { color: "#9013FE", title: "Fioletowy" },
  { color: "#4A90E2", title: "Niebieski" },
  { color: "#50E3C2", title: "Cyjanowy" },
  { color: "#B8E986", title: "Limonkowy" },
  { color: "#000000", title: "Czarny" },
  { color: "#4A4A4A", title: "Szary ciemny" },
  { color: "#9B9B9B", title: "Szary jasny" },
  { color: "#FFFFFF", title: "Biały" },
]

const InputColor: FC<InputColorProps> = ({
  value,
  onChange,
  showText,
  disabled,
}) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const colorValue =
    value && value?.colorHex
      ? tinycolor(value.colorHex).toRgb()
      : {
          r: 144,
          g: 19,
          b: 254,
          a: 1,
        }

  const changeColor = (color: ColorResult) => {
    const colorHex = tinycolor(color.rgb).toHexString().toUpperCase()
    const color_list_name = color_list.filter((val) => val.color === colorHex)
    onChange(
      value?.colorName && value.colorName.length > 0
        ? { ...value, colorHex: colorHex }
        : {
            colorHex: colorHex,
            colorName:
              color_list_name.length > 0 ? color_list_name[0].title : "",
          },
    )
  }
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <InputAntd
        value={value?.colorName}
        onChange={(e) => {
          onChange(
            value
              ? { ...value, colorName: e.target.value }
              : { colorHex: "#9013FE", colorName: e.target.value },
          )
        }}
        disabled={disabled}
      />
      <div style={{ position: "relative" }}>
        <Button
          disabled={disabled}
          onClick={() => setDisplayColorPicker(true)}
          style={{
            backgroundColor:
              "rgb(" +
              colorValue.r +
              "," +
              colorValue.g +
              "," +
              colorValue.b +
              ")",
            width: showText ? "5.5rem" : "auto",
          }}
        >
          {showText ? (
            <span
              style={{
                textAlign: "center",
                filter: "invert(100%)",
                color: value.colorHex,
              }}
            >
              {"#" + tinycolor(colorValue).toHex().toUpperCase()}
            </span>
          ) : (
            " "
          )}
        </Button>
        {displayColorPicker && !disabled ? (
          <div className={styles.popover}>
            <div
              onClick={() => setDisplayColorPicker(false)}
              className={styles.cover}
            />
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
                color={colorValue}
                onChange={changeColor}
                presetColors={color_list}
                disableAlpha
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default InputColor
