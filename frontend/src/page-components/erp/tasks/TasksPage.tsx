import { Text } from "@mantine/core"
import { useRouter } from "next/router"
import { List, Notebook } from "tabler-icons-react"
import Workspace from "../../../components/layout/Workspace"
import NotImplemented from "../../../components/NotImplemented"
import useStarpiUser from "../../../hooks/useStrapiUser"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import TasksList from "./TasksList"

// Complex query https://youtu.be/JaM2rExmmqs?t=640
const TasksPage = () => {
  const { data } = useStarpiUser()
  const router = useRouter()

  const id = getQueryAsIntOrNull(router, "id")

  const childrenIcons = [List, Notebook]

  const childrenLabels = id
    ? ["Lista zamówień", "Właściwości"]
    : ["Lista zamówień"]
  return (
    <Workspace childrenLabels={childrenLabels} childrenIcons={childrenIcons}>
      <TasksList />
      <NotImplemented {...(data as any)} />
    </Workspace>
  )
}

export default TasksPage
