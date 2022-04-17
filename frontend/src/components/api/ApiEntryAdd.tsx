import {
  Box,
  Button,
  Checkbox,
  Group,
  TextInput,
  Stack,
  Input,
  NumberInput,
  Switch,
  ColorInput,
} from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { useForm, useId } from "@mantine/hooks"
import React, { ReactElement } from "react"
import { FC } from "react"
import InputNotImplemented from "../form/InputNotImplemented"

const mapping: { [key: string]: React.ReactNode } = {
  string: <TextInput />,
  number: <NumberInput />,
  boolean: <Switch />,
  enum: <InputNotImplemented />,
  color: <InputNotImplemented />,
  date: <DatePicker />,
  datetime: <InputNotImplemented />,
  product: <InputNotImplemented />,
  productcomponent: <InputNotImplemented />,
  productcomponents: <InputNotImplemented />,
  image: <InputNotImplemented />,
  file: <InputNotImplemented />,
  files: <InputNotImplemented />,
  workstations: <InputNotImplemented />,
  employee: <InputNotImplemented />,
  employees: <InputNotImplemented />,
  submit: <InputNotImplemented />,
}

interface ApiEntryAddProps {
  schema: any
}

const ApiEntryAdd: FC<ApiEntryAddProps> = ({ schema }) => {
  const uuid = useId()
  let initialValues: any = {}
  for (const key in schema) {
    initialValues[key] = schema[key]?.initialValue
  }
  console.log(initialValues)
  const form = useForm({
    initialValues: initialValues,
  })

  return (
    <Box
      // sx={{ maxWidth: 300 }}
      mx="auto"
    >
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stack>
          {Object.keys(schema).map((key: string, index: number) => {
            if (!schema[key]?.hide && mapping[schema[key]?.type]) {
              const new_schema = { ...schema[key] }
              delete new_schema.type
              delete new_schema.initialValue
              return (
                <div key={`${uuid}_${key}`}>
                  {React.cloneElement(
                    mapping[schema[key].type] as ReactElement<any, any>,
                    {
                      ...new_schema,
                      ...form.getInputProps(key),
                    }
                  )}
                </div>
              )
              // return <TextInput {...schema[key]} {...form.getInputProps(key)} />
            }
          })}
          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </Stack>
      </form>
    </Box>
  )
}

export default ApiEntryAdd
