import { ComponentType, CSSProperties } from "react"
import { Box, MantineTheme, Sx, Text } from "@mantine/core"
import EditableText from "./EditableText"
import NotImplemented from "../NotImplemented"
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
import ClientListItem from "../../page-components/erp/clients/ClientListItem"
import { useId } from "@mantine/hooks"
import { truncString } from "../../utils/truncString"
import { makeDefaultListItem } from "../DefaultListItem"
import ProductListItem from "../../page-components/erp/products/ProductListItem"
import UserListItem from "../../page-components/erp/users/UserListItem"
import EditableNumber from "./EditableNumber"
import { Cash, Numbers } from "tabler-icons-react"
import _ from "lodash"
import { useAuthContext } from "../../context/authContext"
import { SxBorder, SxRadius } from "../../styles/basic"
import WorkstationListItem from "../../page-components/erp/workstations/WorkstationListItem"
import EditableTable from "./EditableTable"
import OrderListItem from "../../page-components/erp/orders/OrderListItem"

const ApiProps: {
  [key: string]: {
    ListItem: ComponentType<any>
    copyProvider: (val: any) => string | undefined
  }
} = {
  clients: {
    ListItem: ClientListItem,
    copyProvider: (value: any) =>
      (value?.firstname && value.firstname?.length > 0) ||
      (value?.lastname && value.lastname?.length > 0)
        ? truncString(value.firstname + " " + value.lastname, 40)
        : truncString(value?.username ? value.username : "", 40),
  },
  products: {
    ListItem: ProductListItem,
    copyProvider: (value: any) =>
      value?.name ? truncString(value.name, 40) : undefined,
  },
  users: {
    ListItem: UserListItem,
    copyProvider: (value: any) =>
      value?.username ? truncString(value.username, 40) : undefined,
  },
  orders: {
    ListItem: OrderListItem,
    copyProvider: (value: any) =>
      value?.name ? truncString(value.name, 40) : undefined,
  },
  "orders-archive": {
    ListItem: OrderListItem,
    copyProvider: (value: any) =>
      value?.name ? truncString(value.name, 40) : undefined,
  },
  workstations: {
    ListItem: WorkstationListItem,
    copyProvider: (value: any) =>
      value?.name ? truncString(value.name, 40) : undefined,
  },
}

const Fields: {
  [key: string]: {
    component: ComponentType<any>
    props: { [index: string]: any }
    propsTransform?: (props: { [index: string]: any }) => {
      [index: string]: any
    }
  }
} = {
  text: { component: EditableText, props: {} },
  richtext: { component: EditableRichText, props: {} },
  secrettext: { component: EditableSecretText, props: {} },
  number: {
    component: EditableNumber,
    props: { icon: <Numbers size={18} />, Icon: Numbers },
  },
  money: {
    component: EditableNumber,
    props: {
      rightSection: <Text pr={80}>PLN</Text>,
      icon: <Cash size={18} />,
      Icon: Cash,
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
  apiEntry: {
    component: EditableApiEntry,
    props: {},
    propsTransform: (props) => {
      let newProps = { ...props }
      if (props.entryName in ApiProps) {
        newProps["Element"] = ApiProps[props.entryName].ListItem
        newProps["copyProvider"] = ApiProps[props.entryName].copyProvider
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
      if (props.entryName in ApiProps) {
        newProps["Element"] = ApiProps[props.entryName].ListItem
        newProps["copyProvider"] = ApiProps[props.entryName].copyProvider
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
  let newProps = { ...Fields[props.type].props, ...props }
  if (Fields[props.type].propsTransform) {
    newProps = Fields[props.type]?.propsTransform?.(newProps)
  }
  const Component = Fields[props.type].component
  return <Component {...newProps} />
}

interface EditableProps {
  template: { [key: string]: any }
  data: { [key: string]: any }
  onSubmit?: (key: string, value: any, data: any) => void
  refresh?: () => void
  disabled?: boolean
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

function Editable({ template, data, onSubmit, disabled }: EditableProps) {
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
        if (component_type in Fields) {
          return (
            <Field
              value={data[key]}
              object_key={key}
              {...template[key]}
              onSubmit={onSubmitEntry}
              key={uuid + key}
              disabled={disabled}
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
