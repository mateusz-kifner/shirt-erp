import {
  ActionIcon,
  Box,
  Group,
  InputWrapper,
  Switch,
  Text,
  Checkbox,
} from "@mantine/core"
import { useClickOutside, useClipboard, useHover } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { FC, useEffect, useState, useRef } from "react"
import preventLeave from "../../utils/preventLeave"
import { Copy, Edit } from "../../utils/TablerIcons"

interface DetailsBoolProps {
  label?: string
  value?: boolean
  initialValue?: boolean
  onChange?: (value: boolean | null) => void
  onSubmit?: (value: boolean | null) => void
  disabled?: boolean
  required?: boolean
  checkbox?: boolean
}

const DetailsBool: FC<DetailsBoolProps> = (props) => {
  const {
    label,
    value,
    initialValue,
    onChange,
    onSubmit,
    disabled,
    required,
    checkbox,
  } = props
  const [bool, setBool] = useState<boolean | null>(
    value ? value : initialValue ? initialValue : null
  )
  const { hovered, ref } = useHover()

  useEffect(() => {
    if (value) {
      setBool(value)
    }
  }, [value])

  return (
    <Group style={{ height: 30 }} ref={ref} align="center">
      <Text>{label}</Text>
      {hovered ? (
        checkbox ? (
          <Checkbox />
        ) : (
          <Switch
            value={bool ? 1 : 0}
            // label={label}
            onLabel="Tak"
            offLabel="Nie"
            size="lg"
          />
        )
      ) : (
        <Text weight={700}>{bool ? "Tak" : "Nie"}</Text>
      )}
    </Group>
  )
}

export default DetailsBool
