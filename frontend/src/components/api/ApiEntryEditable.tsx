import { Stack, Text, ActionIcon } from "@mantine/core"
import { useRouter } from "next/router"
import { useId, useState } from "react"
import { Lock, LockOpen, Refresh } from "tabler-icons-react"
import useStrapi from "../../hooks/useStrapi"
import DeleteButton from "../DeleteButton"
import Editable from "../editable/Editable"
import FloatingActions from "../FloatingActions"
import ApiStatusIndicator from "./ApiStatusIndicator"

interface ApiEntryEditableProps<EntryType = any> {
  template: any
  entryName: string
  id: number | null
  allowDelete?: boolean
  disabled?: boolean
  forceActive?: boolean
}

const ApiEntryEditable = <EntryType extends any>({
  template,
  entryName,
  id,
  allowDelete = false,
  disabled = false,
  forceActive = false,
}: ApiEntryEditableProps<EntryType>) => {
  const uuid = useId()
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

  const [active, setActive] = useState<boolean>(forceActive)

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
    <Stack style={{ position: "relative", minHeight: 200 }}>
      {data && Object.keys(data).length > 0 ? (
        <>
          <Stack style={{ position: "relative", minHeight: 200 }}>
            <Editable
              template={template}
              data={data as any}
              onSubmit={apiUpdate}
              active={active}
            />
          </Stack>
          {allowDelete && (
            <DeleteButton
              label={`${entryName}.singular`}
              onDelete={onDelete}
              buttonProps={{ mt: "4rem" }}
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
      <FloatingActions
        actions={
          forceActive
            ? [() => refetch()]
            : [() => setActive((val) => !val), () => refetch()]
        }
        actionIcons={
          forceActive
            ? [<Refresh size={20} key={uuid + "_icon2"} />]
            : [
                active ? <LockOpen size={28} /> : <Lock size={28} />,
                <Refresh size={20} key={uuid + "_icon2"} />,
              ]
        }
        actionsVisible={[!disabled, !disabled]}
        // style={{ zIndex: 0 }}
      />
    </Stack>
  )
}

export default ApiEntryEditable
