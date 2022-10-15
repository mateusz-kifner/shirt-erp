import { ComponentType, useId } from "react"
import React from "react"
import { Stack } from "@mantine/core"

// Make it work with arrays

interface EditableGroupProps {
  label?: string
  value?: { [key: string]: any } | null
  initialValue?: { [key: string]: any } | null
  onSubmit?: (value: { [key: string]: any } | null) => void
  Elements: { [key: string]: { component: ComponentType<any>; props: any } }
}

const EditableGroup = (props: EditableGroupProps) => {
  const uuid = useId()
  const { Elements, value, onSubmit } = props
  return (
    <Stack
      sx={(theme) => ({
        border:
          theme.colorScheme === "dark"
            ? "1px solid #2C2E33"
            : "1px solid #ced4da",
      })}
    >
      {Object.keys(Elements).map((elementKey, index) => {
        const Element = Elements[elementKey].component
        const props = Elements[elementKey].props
        return (
          <Element
            {...props}
            key={uuid + index}
            value={value?.[elementKey]}
            onSubmit={(val: any) => {
              onSubmit?.({ ...value, [elementKey]: val })
            }}
          />
        )
      })}
    </Stack>
  )
}

export default EditableGroup
