import { Button, Group, Modal, Stack, Text, Title } from "@mantine/core"
import { useRouter } from "next/router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { TrashX } from "tabler-icons-react"
import useStrapi from "../../hooks/useStrapi"
import names from "../../models/names.json"
import Editable from "../editable/Editable"
import ApiStatusIndicator from "./ApiStatusIndicator"

interface ApiEntryEditableProps<EntryType = any> {
  template: any
  entryName: string
  id: number | null
}

const ApiEntryEditable = <EntryType extends any>({
  template,
  entryName,
  id,
}: ApiEntryEditableProps<EntryType>) => {
  const [openedDelete, setOpenedDelete] = useState<boolean>(false)
  const { data, update, remove } = useStrapi<EntryType>(entryName, id, {
    query: "populate=*",
  })
  const [status, setStatus] = useState<
    "loading" | "idle" | "error" | "success"
  >("idle")

  const router = useRouter()
  const params = router.query
  const { t } = useTranslation()

  const entryNameData: any =
    entryName in names
      ? names[entryName as keyof typeof names]
      : { singular: "", plural: "" }

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

  return (
    <Stack style={{ position: "relative", minHeight: 200 }}>
      <ApiStatusIndicator
        status={status}
        style={{
          position: "fixed",
          top: "calc(var(--mantine-header-height, 0px) + 8px)",
          right: 8,
        }}
      />
      {data && Object.keys(data).length > 0 ? (
        <>
          <Editable
            template={template}
            data={data as any}
            onSubmit={apiUpdate}
          />
          <Button
            color="red"
            variant="outline"
            leftIcon={<TrashX size={18} />}
            onClick={() => setOpenedDelete(true)}
            mt={"4rem"}
          >
            {t("delete", { entry: t(`${entryName}.singular`) })}
          </Button>
          <Modal
            opened={openedDelete}
            onClose={() => setOpenedDelete(false)}
            title={t("delete", { entry: t(`${entryName}.singular`) })}
            centered
          >
            <Text color="red" mb="xl">
              {t("operation-not-reversible")}
            </Text>
            <Group position="apart" mt="xl">
              <Button
                color="red"
                variant="outline"
                leftIcon={<TrashX size={18} />}
                onClick={() => {
                  id &&
                    remove(id)
                      .then(() => router.push("."))
                      .catch(() => {})
                  setOpenedDelete(false)
                }}
              >
                {t("delete", { entry: t(`${entryName}.singular`) })}
              </Button>
              <Button onClick={() => setOpenedDelete(false)}>
                {t("cancel")}
              </Button>
            </Group>
          </Modal>
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
    </Stack>
  )
}

export default ApiEntryEditable
