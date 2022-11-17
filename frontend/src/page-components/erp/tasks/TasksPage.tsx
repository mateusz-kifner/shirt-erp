import { Text } from "@mantine/core"
import { useRouter } from "next/router"
import { List, Notebook } from "tabler-icons-react"
import Workspace from "../../../components/layout/Workspace"
import NotImplemented from "../../../components/NotImplemented"
import useStarpiUser from "../../../hooks/useStrapiUser"
import { useTranslation } from "../../../i18n"
import { getQueryAsIntOrNull, setQuery } from "../../../utils/nextQueryUtils"
import TasksList from "./TasksList"
import TaskView from "./TaskView"

// Complex query https://youtu.be/JaM2rExmmqs?t=640
const TasksPage = () => {
  const { data } = useStarpiUser()
  const router = useRouter()
  const { t } = useTranslation()

  const id = getQueryAsIntOrNull(router, "id")

  const childrenIcons = [List, Notebook]

  const childrenLabels = id
    ? ["Lista zamówień", "Właściwości"]
    : ["Lista zamówień"]
  return (
    <Workspace childrenLabels={childrenLabels} childrenIcons={childrenIcons}>
      <TasksList
        onChange={(val: any) => {
          router.push("/erp/tasks/" + val.id)
        }}
      />
      {id !== null ? (
        <TaskView order={data?.orders?.[id] ?? null} />
      ) : (
        <Text align="center">{t("no data")}</Text>
      )}
    </Workspace>
  )
}

export default TasksPage
