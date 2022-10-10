import { Group, Switch, Text, Checkbox } from "@mantine/core"
import { useHover } from "@mantine/hooks"

import { FC, useEffect, useState, useRef } from "react"

// FIXME: respect disabled state
// TODO: Remake this to respect height

interface EditableBoolProps {
  label?: string
  value?: boolean
  initialValue?: boolean
  onSubmit?: (value: boolean) => void
  disabled?: boolean
  required?: boolean
  checkbox?: boolean
  checkLabels: { checked: string; unchecked: string }
  stateLabels: { checked: string; unchecked: string }
}

const EditableBool: FC<EditableBoolProps> = (props) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    checkbox,
    checkLabels = { checked: undefined, unchecked: undefined },
    stateLabels = { checked: "Tak", unchecked: "Nie" },
  } = props
  const [bool, setBool] = useState<boolean>(value ?? initialValue ?? false)
  const [dirty, setDirty] = useState<boolean>(false)
  const { hovered, ref } = useHover()

  useEffect(() => {
    value !== undefined && setBool(value)
  }, [value])

  useEffect(() => {
    if (dirty) {
      onSubmit?.(bool)
    }
    // eslint-disable-next-line
  }, [bool])

  return (
    <Group ref={ref} align="center">
      <Text
        style={{
          wordBreak: "break-word",
          whiteSpace: "pre-line",
          lineHeight: 1.55,
        }}
      >
        {label}
        <div
          style={{
            display: "inline-block",
            paddingLeft: "12px",
            position: "relative",
          }}
        >
          {hovered ? (
            checkbox ? (
              <Checkbox
                onChange={(e) => {
                  setDirty(true)
                  setBool(e.target.checked)
                }}
                checked={bool}
                style={{
                  position: "absolute",
                  bottom: -4,
                }}
              />
            ) : (
              <Switch
                onChange={(e) => {
                  setDirty(true)
                  setBool(e.target.checked)
                }}
                checked={bool}
                onLabel={checkLabels.checked}
                offLabel={checkLabels.unchecked}
                style={{
                  display: "inline-block",
                  top: -12,
                  position: "relative",
                }}
              />
            )
          ) : (
            <Text weight={700} style={{ minHeight: 37 }}>
              {bool ? stateLabels.checked : stateLabels.unchecked}
            </Text>
          )}
        </div>
      </Text>
    </Group>
  )
}

export default EditableBool
