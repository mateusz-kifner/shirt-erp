import { Text } from "@mantine/core"
import NotImplemented from "../../../components/NotImplemented"
import useStarpiUser from "../../../hooks/useStrapiUser"

// Complex query https://youtu.be/JaM2rExmmqs?t=640
const TasksPage = () => {
  const { data } = useStarpiUser()
  return (
    <Text>
      <NotImplemented {...(data as any)} />
    </Text>
  )
}

export default TasksPage
