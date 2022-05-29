import { FC } from "react"
import { Text } from "@mantine/core"
import DetailsText from "../details/DetailsText"
import NotImplemented from "../NotImplemented"
import DetailsRichText from "../details/DetailsRichText"
import DetailsSecretText from "../details/DetailsSecretText"
import { useRecoilValue } from "recoil"
import { loginState } from "../../atoms/loginState"
import { useId } from "@mantine/hooks"
import DetailsDateTime from "./DetailsDateTime"
import DetailsDate from "./DetailsDate"
import DetailsBool from "./DetailsBool"
import DetailsColor from "./DetailsColor"
import DetailsEnum from "./DetailsEnum"
import DetailsJSON from "./DetailsJSON"
import DetailsApiIconId from "./DetailsApiIconId"
import DetailsAddress from "./DetailsAddress"
import DetailsFiles from "./DetailsFiles"
import DetailsArray from "./DetailsArray"

interface DetailsProps {
  template: { [key: string]: any }
  data: { [key: string]: any }
  onSubmit?: (key: string, value: any) => void
}

const Details: FC<DetailsProps> = ({ template, data, onSubmit }) => {
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
              <DetailsText
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "richtext":
            return (
              <DetailsRichText
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )

          case "secrettext":
            return (
              <DetailsSecretText
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "datetime":
            return (
              <DetailsDateTime
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "date":
            return (
              <DetailsDate
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "boolean":
            return (
              <DetailsBool
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "color":
            return (
              <DetailsColor
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "enum":
            return (
              <DetailsEnum
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "json":
            return (
              <DetailsJSON
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "iconId":
            return (
              <DetailsApiIconId
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "address":
            return (
              <DetailsAddress
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "file":
          case "image":
            return (
              <DetailsFiles
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
                maxFileCount={1}
              />
            )
          case "files":
            return (
              <DetailsFiles
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
              />
            )
          case "arrayText":
            return (
              <DetailsArray
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
                Element={DetailsText}
              />
            )
          case "arrayColor":
            return (
              <DetailsArray
                value={data[key]}
                {...template[key]}
                key={uuid + key}
                onSubmit={onSubmitEntry}
                Element={DetailsColor}
              />
            )
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

export default Details
