import { ComponentType, CSSProperties } from "react"
import { Box, MantineTheme, Sx, Text } from "@mantine/core"
import NotImplemented from "../NotImplemented"
import { useId } from "@mantine/hooks"
import { useAuthContext } from "../../context/authContext"
import { SxBorder, SxRadius } from "../../styles/basic"

// Editable imports
import EditableText from "./EditableText"
import EditableRichText from "./EditableRichText"
import EditableSecretText from "./EditableSecretText"
import EditableDateTime from "./EditableDateTime"
import EditableDate from "./EditableDate"
import EditableBool from "./EditableBool"
import EditableColor from "./EditableColor"
import EditableEnum from "./EditableEnum"
import EditableJSON from "./EditableJSON"
import EditableApiIconId from "./EditableApiIconId"
import EditableAddress from "./EditableAddress"
import EditableFiles from "./EditableFiles"
import EditableArray from "./EditableArray"
import EditableApiEntry from "./EditableApiEntry"
import EditableApiEntryId from "./EditableApiEntryId"
import EditableNumber from "./EditableNumber"
import EditableTable from "./EditableTable"
import EditableDesign from "./EditableDesign"
import EditableTableView from "./EditableTableView"

import { Cash, Numbers } from "tabler-icons-react"
import apiListItems from "./apiListItems"
import { makeDefaultListItem } from "../DefaultListItem"

export type editableFields = {
  [key: string]: {
    component: ComponentType<any>
    props: { [index: string]: any }
    propsTransform?: (props: { [index: string]: any }) => {
      [index: string]: any
    }
  }
}

const editableFields: editableFields = {
  title: {
    component: EditableText,
    props: { style: { fontSize: "1.4em" } },
  },
  text: { component: EditableText, props: {} },
  richtext: { component: EditableRichText, props: {} },
  secrettext: { component: EditableSecretText, props: {} },
  number: {
    component: EditableNumber,
    props: { leftSection: <Numbers size={18} /> },
  },
  money: {
    component: EditableNumber,
    props: {
      rightSection: <Text pr="sm">PLN</Text>,
      leftSection: <Cash size={18} />,
      increment: 1,
    },
  },
  datetime: { component: EditableDateTime, props: {} },
  date: { component: EditableDate, props: {} },
  boolean: { component: EditableBool, props: {} },
  color: { component: EditableColor, props: {} },
  enum: { component: EditableEnum, props: {} },
  json: { component: EditableJSON, props: {} },
  iconId: { component: EditableApiIconId, props: {} },
  address: { component: EditableAddress, props: {} },
  file: { component: EditableFiles, props: { maxCount: 1 } },
  image: { component: EditableFiles, props: { maxCount: 1 } },
  files: { component: EditableFiles, props: {} },
  table: { component: EditableTable, props: {} },
  tableView: { component: EditableTableView, props: {} },
  design: { component: EditableDesign, props: {} },
  designView: { component: EditableDesign, props: {} },
  apiEntry: {
    component: EditableApiEntry,
    props: {},
    propsTransform: (props) => {
      let newProps = { ...props }
      if (props.entryName in apiListItems) {
        newProps["Element"] = apiListItems[props.entryName].ListItem
        newProps["copyProvider"] = apiListItems[props.entryName].copyProvider
      } else {
        newProps["Element"] = makeDefaultListItem("name")
      }
      return newProps
    },
  },
  apiEntryId: {
    component: EditableApiEntryId,
    props: {},
    propsTransform: (props) => {
      let newProps = { ...props }
      if (props.entryName in apiListItems) {
        newProps["Element"] = apiListItems[props.entryName].ListItem
        newProps["copyProvider"] = apiListItems[props.entryName].copyProvider
      } else {
        newProps["Element"] = makeDefaultListItem("name")
      }
      return newProps
    },
  },
  group: {
    component: EditableWrapper,
    props: {
      sx: [
        SxBorder,
        SxRadius,
        (theme: MantineTheme) => ({
          padding: theme.spacing.xs,
          display: "flex",
          gap: theme.spacing.xs,
          "&>*": { flex: "1" },
        }),
      ],
    },
    propsTransform: (props) => {
      let newProps = {
        ...props,
        data: props.value ?? {},
        onSubmit: (key: string, value: any, data: any) => {
          console.log("group submit", key, value, data)
          props.onSubmit({ ...data, [key]: value })
        },
      }

      return newProps
    },
  },
  array: {
    component: EditableArray,
    props: {},
    propsTransform: (props) => {
      let newProps = {
        ...props,
        Element: Field,
        elementProps: {
          ...props,
          type: props.arrayType,
        },
      }
      return newProps
    },
  },
}

function Field(props: any) {
  let newProps = { ...editableFields[props.type].props, ...props }
  if (editableFields[props.type].propsTransform) {
    newProps = editableFields[props.type]?.propsTransform?.(newProps)
  }
  const Component = editableFields[props.type].component
  return <Component {...newProps} />
}

function EditableWrapper(
  props: EditableProps & { style?: CSSProperties; sx?: Sx | (Sx | undefined)[] }
) {
  return (
    <Box style={props.style} sx={props.sx}>
      <Editable {...props} />
    </Box>
  )
}

interface EditableProps {
  template: { [key: string]: any }
  data: { [key: string]: any }
  onSubmit?: (key: string, value: any, data: any) => void
  active?: boolean
}

function Editable({ template, data, onSubmit, active }: EditableProps) {
  const { debug } = useAuthContext()
  const uuid = useId()
  return (
    <>
      {Object.keys(template).map((key) => {
        if (debug && key === "id")
          return <Text key={uuid + key}>ID: {data[key]}</Text>

        const onSubmitEntry = (value: any) => {
          onSubmit?.(key, value, data)
          onSubmit &&
            template[key].onSubmitTrigger &&
            template[key].onSubmitTrigger(
              key,
              value,
              data,
              (key: string, value: any, data: any) => {
                onSubmit(key, value, data)
              }
            )
        }

        if (debug && !(key in template))
          return (
            <NotImplemented
              message={"Key doesn't have template"}
              object_key={key}
              value={data[key]}
              key={uuid + key}
            />
          )

        const component_type = template[key].type
        if (component_type in editableFields) {
          return (
            <Field
              active={active}
              value={data[key]}
              object_key={key}
              {...template[key]}
              onSubmit={onSubmitEntry}
              key={uuid + key}
            />
          )
        }
        if (debug) {
          return (
            <NotImplemented
              message={"Key has unknown type"}
              object_key={key}
              value={data[key]}
              template={template[key]}
              key={uuid + key}
            />
          )
        }
        return null
      })}
    </>
  )
}

export default Editable
