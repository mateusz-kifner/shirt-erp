import { FC } from "react"
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
import ClientListItem from "../../pages/erp/clients/ClientListItem"
import { useRecoilValue } from "recoil"
import { loginState } from "../../atoms/loginState"
import { useId } from "@mantine/hooks"
import { truncString } from "../../utils/truncString"
import { makeDefaultListItem } from "../DefaultListItem"
import EditableGraph from "./EditableGraph"
import ProductListItem from "../../pages/erp/products/ProductListItem"
import UserListItem from "../../pages/erp/users/UserListItem"
import EditableNumber from "./EditableNumber"
import { Cash, Numbers } from "tabler-icons-react"

interface EditableProps {
  template: { [key: string]: any }
  data: { [key: string]: any }
  onSubmit?: (key: string, value: any) => void
}

const Editable: FC<EditableProps> = ({ template, data, onSubmit }) => {
  const user = useRecoilValue(loginState)
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
        if (key === "id" && user.debug === true)
          return <Text key={uuid + key}>ID: {data[key]}</Text>

        const onSubmitEntry = (value: any) => onSubmit && onSubmit(key, value)
        const getApiEntry = (props: any = {}) => {}
        if (!(key in template))
          return user?.debug === true ? (
            <NotImplemented
              message={"Key doesn't have template"}
              object_key={key}
              value={data[key]}
              key={uuid + key}
            />
          ) : null
        switch (template[key].type) {
          case "text":
            return (
              <EditableText
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "richtext":
            return (
              <EditableRichText
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )

          case "secrettext":
            return (
              <EditableSecretText
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "number":
            return (
              <EditableNumber
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
                icon={<Numbers size={18} />}
                Icon={Numbers}
              />
            )
          case "money":
            return (
              <EditableNumber
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
                rightSection={<Text pr={80}>PLN</Text>}
                icon={<Cash size={18} />}
                Icon={Cash}
              />
            )
          case "datetime":
            return (
              <EditableDateTime
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "date":
            return (
              <EditableDate
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "boolean":
            return (
              <EditableBool
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "color":
            return (
              <EditableColor
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "enum":
            return (
              <EditableEnum
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "json":
            return (
              <EditableJSON
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "iconId":
            return (
              <EditableApiIconId
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "address":
            return (
              <EditableAddress
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "file":
          case "image":
            return (
              <EditableFiles
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
                maxCount={1}
              />
            )
          case "files":
            return (
              <EditableFiles
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "graph":
            return (
              <EditableGraph
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "array":
            switch (template[key].arrayType) {
              case "text":
                return (
                  <EditableArray
                    value={data[key]}
                    {...template[key]}
                    key={uuid + key}
                    onSubmit={onSubmitEntry}
                    Element={EditableText}
                  />
                )
              case "color":
                return (
                  <EditableArray
                    value={data[key]}
                    {...template[key]}
                    key={uuid + key}
                    onSubmit={onSubmitEntry}
                    Element={EditableColor}
                  />
                )
              case "apiEntry":
                switch (template[key].entryName) {
                  case "users":
                    return (
                      <EditableArray
                        value={data[key]}
                        {...template[key]}
                        key={uuid + key}
                        onSubmit={onSubmitEntry}
                        Element={EditableApiEntry}
                        elementProps={{
                          entryName: template[key].entryName,

                          Element: UserListItem,
                          copyProvider: (value: any) =>
                            value?.username
                              ? truncString(value.username, 40)
                              : undefined,
                          withErase: false,
                        }}
                      />
                    )
                  case "products":
                    return (
                      <EditableArray
                        value={data[key]}
                        {...template[key]}
                        key={uuid + key}
                        onSubmit={onSubmitEntry}
                        Element={EditableApiEntry}
                        elementProps={{
                          entryName: template[key].entryName,

                          Element: ProductListItem,
                          copyProvider: (value: any) =>
                            value?.name ? value.name : undefined,

                          withErase: false,
                        }}
                      />
                    )
                  case "clients":
                    return (
                      <EditableArray
                        value={data[key]}
                        {...template[key]}
                        key={uuid + key}
                        onSubmit={onSubmitEntry}
                        Element={EditableApiEntry}
                        elementProps={{
                          entryName: template[key].entryName,
                          Element: ClientListItem,
                          copyProvider: (value: any) =>
                            (value?.firstname && value.firstname?.length > 0) ||
                            (value?.lastname && value.lastname?.length > 0)
                              ? value.firstname + " " + value.lastname
                              : value?.username
                              ? value.username
                              : "",
                          withErase: false,
                        }}
                      />
                    )

                  case "orders":
                    return (
                      <EditableArray
                        value={data[key]}
                        {...template[key]}
                        key={uuid + key}
                        onSubmit={onSubmitEntry}
                        Element={EditableApiEntry}
                        elementProps={{
                          entryName: template[key].entryName,
                          Element: makeDefaultListItem("name"),
                          copyProvider: (value: any) =>
                            value?.name && value.name?.length > 0
                              ? value.name
                              : "",

                          withErase: false,
                        }}
                      />
                    )
                  case "orders-archive":
                    return (
                      <EditableArray
                        value={data[key]}
                        {...template[key]}
                        key={uuid + key}
                        onSubmit={onSubmitEntry}
                        Element={EditableApiEntry}
                        elementProps={{
                          entryName: template[key].entryName,
                          Element: makeDefaultListItem("name"),
                          copyProvider: (value: any) =>
                            value?.name && value.name?.length > 0
                              ? value.name
                              : "",

                          withErase: false,
                        }}
                      />
                    )
                  case "workstations":
                    return (
                      <EditableArray
                        value={data[key]}
                        {...template[key]}
                        key={uuid + key}
                        onSubmit={onSubmitEntry}
                        Element={EditableApiEntry}
                        elementProps={{
                          entryName: template[key].entryName,
                          Element: makeDefaultListItem("name"),
                          copyProvider: (value: any) =>
                            value?.name && value.name?.length > 0
                              ? value.name
                              : "",

                          withErase: false,
                        }}
                      />
                    )
                  default:
                    return user?.debug === true ? (
                      <NotImplemented
                        message={"Key has unknown entryName"}
                        object_key={key}
                        value={data[key]}
                        template={template[key]}
                        key={uuid + key}
                      />
                    ) : null
                }
              case "apiEntryId":
                switch (template[key].entryName) {
                  case "users":
                    return (
                      <EditableArray
                        value={data[key]}
                        {...template[key]}
                        key={uuid + key}
                        onSubmit={onSubmitEntry}
                        Element={EditableApiEntryId}
                        elementProps={{
                          entryName: template[key].entryName,

                          Element: UserListItem,
                          copyProvider: (value: any) =>
                            value?.username
                              ? truncString(value.username, 40)
                              : undefined,
                          withErase: false,
                        }}
                      />
                    )
                  case "products":
                    return (
                      <EditableArray
                        value={data[key]}
                        {...template[key]}
                        key={uuid + key}
                        onSubmit={onSubmitEntry}
                        Element={EditableApiEntryId}
                        elementProps={{
                          entryName: template[key].entryName,

                          Element: ProductListItem,
                          copyProvider: (value: any) =>
                            value?.name
                              ? truncString(value.name, 40)
                              : undefined,

                          withErase: false,
                        }}
                      />
                    )
                  case "clients":
                    return (
                      <EditableArray
                        value={data[key]}
                        {...template[key]}
                        key={uuid + key}
                        onSubmit={onSubmitEntry}
                        Element={EditableApiEntryId}
                        elementProps={{
                          entryName: template[key].entryName,
                          Element: ClientListItem,
                          copyProvider: (value: any) =>
                            (value?.firstname && value.firstname?.length > 0) ||
                            (value?.lastname && value.lastname?.length > 0)
                              ? truncString(
                                  value.firstname + " " + value.lastname,
                                  40
                                )
                              : truncString(
                                  value?.username ? value.username : "",
                                  40
                                ),

                          withErase: false,
                        }}
                      />
                    )
                  case "workstations":
                    return (
                      <EditableArray
                        value={data[key]}
                        {...template[key]}
                        key={uuid + key}
                        onSubmit={onSubmitEntry}
                        Element={EditableApiEntryId}
                        elementProps={{
                          entryName: template[key].entryName,
                          Element: makeDefaultListItem("name"),
                          copyProvider: (value: any) =>
                            value?.name && value.name?.length > 0
                              ? truncString(value.name, 40)
                              : "",

                          withErase: false,
                        }}
                      />
                    )
                  default:
                    return user?.debug === true ? (
                      <NotImplemented
                        message={"Key has unknown entryName"}
                        object_key={key}
                        value={data[key]}
                        template={template[key]}
                        key={uuid + key}
                      />
                    ) : null
                }
              default:
                return user?.debug === true ? (
                  <NotImplemented
                    message={"Key has unknown arrayType"}
                    object_key={key}
                    value={data[key]}
                    template={template[key]}
                    key={uuid + key}
                  />
                ) : null
            }

          case "apiEntry":
            switch (template[key].entryName) {
              case "users":
                return (
                  <EditableApiEntry
                    value={data[key]}
                    key={uuid + key}
                    {...template[key]}
                    onSubmit={onSubmitEntry}
                    Element={UserListItem}
                    copyProvider={(value: any) =>
                      value?.username
                        ? truncString(value.username, 40)
                        : undefined
                    }
                  />
                )
              case "products":
                return (
                  <EditableApiEntry
                    value={data[key]}
                    key={uuid + key}
                    {...template[key]}
                    onSubmit={onSubmitEntry}
                    Element={ProductListItem}
                    copyProvider={(value: any) =>
                      value?.name ? truncString(value.name, 40) : undefined
                    }
                  />
                )
              case "clients":
                return (
                  <EditableApiEntry
                    value={data[key]}
                    key={uuid + key}
                    {...template[key]}
                    onSubmit={onSubmitEntry}
                    Element={ClientListItem}
                    copyProvider={(value: any) =>
                      (value?.firstname && value.firstname?.length > 0) ||
                      (value?.lastname && value.lastname?.length > 0)
                        ? truncString(
                            value.firstname + " " + value.lastname,
                            40
                          )
                        : truncString(value?.username ? value.username : "", 40)
                    }
                  />
                )
              default:
                return user?.debug === true ? (
                  <NotImplemented
                    message={"Key has unknown entryName"}
                    object_key={key}
                    value={data[key]}
                    template={template[key]}
                    key={uuid + key}
                  />
                ) : null
            }
          case "apiEntryId":
            switch (template[key].entryName) {
              case "users":
                return (
                  <EditableApiEntryId
                    value={data[key]}
                    key={uuid + key}
                    {...template[key]}
                    onSubmit={onSubmitEntry}
                    Element={UserListItem}
                    copyProvider={(value: any) =>
                      value?.username
                        ? truncString(value.username, 40)
                        : undefined
                    }
                  />
                )
              case "products":
                return (
                  <EditableApiEntryId
                    value={data[key]}
                    key={uuid + key}
                    {...template[key]}
                    onSubmit={onSubmitEntry}
                    Element={ProductListItem}
                    copyProvider={(value: any) =>
                      value?.name ? truncString(value.name, 40) : undefined
                    }
                  />
                )
              case "clients":
                return (
                  <EditableApiEntryId
                    value={data[key]}
                    key={uuid + key}
                    {...template[key]}
                    onSubmit={onSubmitEntry}
                    Element={ClientListItem}
                    copyProvider={(value: any) =>
                      (value?.firstname && value.firstname?.length > 0) ||
                      (value?.lastname && value.lastname?.length > 0)
                        ? truncString(
                            value.firstname + " " + value.lastname,
                            40
                          )
                        : truncString(value?.username ? value.username : "", 40)
                    }
                  />
                )
              default:
                return user?.debug === true ? (
                  <NotImplemented
                    message={"Key has unknown entryName"}
                    object_key={key}
                    value={data[key]}
                    template={template[key]}
                    key={uuid + key}
                  />
                ) : null
            }
          default:
            return user?.debug === true ? (
              <NotImplemented
                message={"Key has unknown type"}
                object_key={key}
                value={data[key]}
                template={template[key]}
                key={uuid + key}
              />
            ) : null
        }
      })}
    </>
  )
}

export default Editable
