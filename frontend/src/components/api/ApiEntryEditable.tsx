import { Text, ActionIcon } from "@mantine/core"
import { useRouter } from "next/router"
import { useState } from "react"
import { Refresh } from "tabler-icons-react"
import useStrapi from "../../hooks/useStrapi"
import DeleteButton from "../DeleteButton"
import Editable from "../editable/Editable"
import ApiStatusIndicator from "./ApiStatusIndicator"

interface ApiEntryEditableProps<EntryType = any> {
  template: any
  entryName: string
  id: number | null
  allowDelete?: boolean
}

const ApiEntryEditable = <EntryType extends any>({
  template,
  entryName,
  id,
  allowDelete,
}: ApiEntryEditableProps<EntryType>) => {
  const { data, update, remove, refetch } = useStrapi<EntryType>(
    entryName,
    id,
    {
      query: "populate=*",
    }
  )
  const [status, setStatus] = useState<
    "loading" | "idle" | "error" | "success"
  >("idle")

  const router = useRouter()

  const apiUpdate = (key: string, val: any) => {
    setStatus("loading")
    update({ [key]: val } as Partial<EntryType>)
      .then((val) => {
        setStatus("success")
      })
      .catch((err) => {
        setStatus("error")
      })
  }

  const onDelete = () => {
    id &&
      remove(id)
        .then(() => router.push("."))
        .catch(() => {})
  }

  return (
    <div className="flex flex-col gap-3 relative min-h-[200px]">
      {data && Object.keys(data).length > 0 ? (
        <>
          <div className="flex flex-col gap-3 relative min-h-[200px]">
            <Editable
              template={template}
              data={data as any}
              onSubmit={apiUpdate}
            />
          </div>
          {allowDelete && (
            <DeleteButton
              label={`${entryName}.singular`}
              onDelete={onDelete}
              buttonProps={{ style: { marginTop: "4rem" } }}
            />
          )}
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
      <ApiStatusIndicator
        status={status}
        style={{
          position: "fixed",
          top: "calc(var(--mantine-header-height, 0px) + 8px)",
          right: 8,
        }}
      />
      <ActionIcon
        onClick={() => refetch()}
        radius="xl"
        sx={(theme) => ({
          position: "absolute",
          top: 0,
          right: 0,
        })}
        size="xs"
      >
        <Refresh />
      </ActionIcon>
    </div>
  )
}

export default ApiEntryEditable
