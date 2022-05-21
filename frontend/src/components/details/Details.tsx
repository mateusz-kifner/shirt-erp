import { FC } from "react"
import { Text } from "@mantine/core"
import DetailsText from "../details/DetailsText"
import NotImplemented from "../NotImplemented"
import DetailsRichText from "../details/DetailsRichText"
import DetailsSecretText from "../details/DetailsSecretText"
import { useRecoilValue } from "recoil"
import { loginState } from "../../atoms/loginState"
import { useId } from "@mantine/hooks"

interface DetailsProps {
  schema: any
  data: any
}

const Details: FC<DetailsProps> = ({ schema, data }) => {
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
      {Object.keys(data).map((key) => {
        if (key === "id" && user.debug === true)
          return <Text key={uuid + key}>ID: {data[key]}</Text>

        if (!(key in schema))
          return user?.debug === true ? (
            <NotImplemented
              message={"Key doesn't have Schema"}
              object_key={key}
              value={data[key]}
              key={uuid + key}
            />
          ) : null
        switch (schema[key].type) {
          case "text":
            return (
              <DetailsText
                value={data[key]}
                {...schema[key]}
                key={uuid + key}
              />
            )
          case "richtext":
            return (
              <DetailsRichText
                value={data[key]}
                {...schema[key]}
                key={uuid + key}
              />
            )

          case "secrettext":
            return (
              <DetailsSecretText
                value={data[key]}
                {...schema[key]}
                key={uuid + key}
              />
            )

          default:
            return user?.debug === true ? (
              <NotImplemented
                message={"Key has unknown type"}
                object_key={key}
                value={data[key]}
                schema={schema[key]}
                key={uuid + key}
              />
            ) : null
        }
      })}
    </>
  )
}

export default Details
