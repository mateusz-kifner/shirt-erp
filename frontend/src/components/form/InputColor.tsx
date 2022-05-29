import { ColorInput, Group, InputWrapper, TextInput } from "@mantine/core"
import React, { FC, useEffect, useState } from "react"
import { ColorType } from "../../types/ColorType"

interface InputColorProps {
  label?: string
  placeholder?: string
  value?: ColorType
  onChange?: (value: ColorType | null) => void
  disabled?: boolean
  required?: boolean
}

const InputColor: FC<InputColorProps> = (props) => {
  const { label, placeholder, value, onChange, disabled, required } = props
  const [color, setColor] = useState<ColorType>(
    value
      ? value
      : {
          name: "Biały",
          hex: "#ffffff",
        }
  )
  useEffect(() => {
    onChange && onChange(color)
  }, [color])
  return (
    <InputWrapper label={label}>
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
        />
        <TextInput
          placeholder={placeholder}
          value={color?.name}
          onChange={(event) => {
            setColor((old_color) => ({
              ...old_color,
              name: event.currentTarget.value,
            }))
          }}
          disabled={disabled}
          required={required}
        />
      </Group>
    </InputWrapper>
  )
}

export default InputColor
