import {
  Box,
  Button,
  Group,
  TextInput,
  Stack,
  NumberInput,
} from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { useForm, useId } from "@mantine/hooks"
import React, { memo, ReactElement, useCallback, useMemo } from "react"
import { FC } from "react"
import useStrapi from "../../hooks/useStrapi"
import InputBoolean from "../form/InputBoolean"
import InputColor from "../form/InputColor"
import InputDateTime from "../form/InputDateTime"
import InputEnum from "../form/InputEnum"
import InputFile from "../form/InputFile"
import InputFiles from "../form/InputFiles"
import NotImplemented from "../NotImplemented"
import InputApiEntry from "./InputApiEntry"
import InputApiIconId from "./InputApiIconId"

const mapping: { [key: string]: React.ReactNode } = {
  string: <TextInput />,
  number: <NumberInput />,
  boolean: <InputBoolean />,
  enum: <InputEnum />,
  color: <InputColor />,
  date: <DatePicker />,
  datetime: <InputDateTime />,
  apiEntry: <InputApiEntry />,
  productComponent: <NotImplemented />,
  productComponents: <NotImplemented />,
  image: <InputFile />,
  file: <InputFile />,
  files: <InputFiles />,
  workstations: <NotImplemented />,
  employees: <NotImplemented />,
  submit: <NotImplemented />,
  iconId: <InputApiIconId />,
}

interface ApiEntryAddProps {
  schema: any
  entryName: string
}

const ApiEntryAdd: FC<ApiEntryAddProps> = ({ schema, entryName }) => {
  const uuid = useId()
  const { add } = useStrapi(entryName)
  const generateInitialValues = useCallback(() => {
    let initialValues: any = {}
    for (const key in schema) {
      initialValues[key] = schema[key]?.initialValue
    }
    return initialValues
  }, [schema])

  const form = useForm({
    initialValues: generateInitialValues(),
  })

  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit((values) => add(values))}>
        <Stack>
          {Object.keys(schema).map((key: string, index: number) => {
            if (!schema[key]?.hidden && mapping[schema[key]?.type]) {
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
            } else {
              return (
                <NotImplemented
                  ERROR="NOT IN MAPPING"
                  {...schema[key]}
                  key={`${uuid}_${key}`}
                />
              )
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
