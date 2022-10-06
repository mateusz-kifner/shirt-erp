import { ComponentType, FC } from "react"
import { Text } from "@mantine/core"
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
    ListItem: makeDefaultListItem("name"),
    copyProvider: (value: any) =>
      value?.name ? truncString(value.name, 40) : undefined,
  },
  "orders-archive": {
    ListItem: makeDefaultListItem("name"),
    copyProvider: (value: any) =>
      value?.name ? truncString(value.name, 40) : undefined,
  },
  workstations: {
    ListItem: makeDefaultListItem("name"),
    copyProvider: (value: any) =>
      value?.name ? truncString(value.name, 40) : undefined,
  },
}

const Fields: {
  [key: string]: { component: ComponentType<any>; props: any }
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
  apiEntry: { component: EditableApiEntry, props: {} },
  apiEntryId: { component: EditableApiEntryId, props: {} },
}

const Field = (props: any) => {
  let componentProps = Fields[props.type].props
  if (props.type === "apiEntry" || props.type === "apiEntryId") {
    if (props.entryName in ApiProps) {
      componentProps["Element"] = ApiProps[props.entryName].ListItem
      componentProps["copyProvider"] = ApiProps[props.entryName].copyProvider
    } else {
      componentProps["Element"] = makeDefaultListItem("name")
    }
  }
  const Component = Fields[props.type].component
  return <Component {...props} {...componentProps} />
}

interface EditableProps {
  template: { [key: string]: any }
  data: { [key: string]: any }
  onSubmit?: (key: string, value: any) => void
  refresh?: () => void
}

const Editable: FC<EditableProps> = ({ template, data, onSubmit, refresh }) => {
  const { debug } = useAuthContext()
  const uuid = useId()
  if (!(data && Object.keys(data).length > 0))
    return (
      <Text
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        Brak danych
      </Text>
    )
  return (
    <>
      {Object.keys(template).map((key) => {
        if (key === "id" && debug === true)
          return <Text key={uuid + key}>ID: {data[key]}</Text>

        const onSubmitEntry = (value: any) => {
          onSubmit?.(key, value)
          onSubmit &&
            template[key].onSubmitTrigger &&
            template[key].onSubmitTrigger(
              key,
              value,
              data,
              (key: string, value: any) => {
                onSubmit(key, value)
              }
            )
        }
        if (!(key in template))
          return debug === true ? (
            <NotImplemented
              message={"Key doesn't have template"}
              object_key={key}
              value={data[key]}
              key={uuid + key}
            />
          ) : null

        const component_type = template[key].type
        if (component_type in Fields) {
          return (
            <Field
              value={data[key]}
              {...template[key]}
              onSubmit={onSubmitEntry}
              key={uuid + key}
            />
          )
        } else if (component_type == "array") {
          return (
            <EditableArray
              value={data[key]}
              {...template[key]}
              onSubmit={onSubmitEntry}
              key={uuid + key}
              Element={Field}
              elementProps={{
                ...template[key],
                type: template[key].arrayType,
              }}
            />
          )
        }

        return debug === true ? (
          <NotImplemented
            message={"Key has unknown type"}
            object_key={key}
            value={data[key]}
            template={template[key]}
            key={uuid + key}
          />
        ) : null
      })}
    </>
  )
}

export default Editable
