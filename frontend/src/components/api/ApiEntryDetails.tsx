import { Group, Stack, Text, Table, LoadingOverlay } from "@mantine/core"
import { useDocumentTitle, useId } from "@mantine/hooks"
import React, { FC, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { loginState } from "../../atoms/loginState"
import useStrapi from "../../hooks/useStrapi"
import DetailsText from "../details/DetailsText"
import NotImplemented from "../NotImplemented"
import { useLocation, useParams } from "react-router-dom"
import names from "../../schemas/names.json"

interface ApiEntryDetailsProps {
  schema: any
  entryName: string
  id: number | null
}

const ApiEntryDetails: FC<ApiEntryDetailsProps> = ({
  schema,
  entryName,
  id,
}) => {
  const { data, status } = useStrapi(entryName, id)
  const user = useRecoilValue(loginState)
  const uuid = useId()
  const location = useLocation()
  let params = useParams()

  const entryNameData: any =
    //@ts-ignore
    entryName in names ? names[entryName] : { singular: "", plural: "" }

  useDocumentTitle(
    params.id
      ? "ShirtERP - " +
          entryNameData.singular +
          " " +
          data?.firstname +
          " " +
          data?.lastname
      : "ShirtERP - " + entryNameData.plural
  )

  return (
    <Stack style={{ position: "relative", minHeight: 200 }}>
      {data && Object.keys(data).length > 0 ? (
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
              case "string":
                return (
                  <DetailsText
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
      ) : (
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
      )}
      <LoadingOverlay visible={status === "loading"} radius="xl" />
    </Stack>
  )
}

export default ApiEntryDetails
