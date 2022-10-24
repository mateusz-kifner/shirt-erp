import { Text } from "@mantine/core"
import NotImplemented from "../../../components/NotImplemented"
import axios from "axios"
import { useQuery } from "react-query"

const fetchData = async (entryName?: string | null) => {
  if (!entryName) return
  const res = await axios.get(`/${entryName}?populate=%2A`)
  return res.data
}

const TasksPage = () => {
  const { data } = useQuery("users", () => fetchData("users/me"))
  return (
    <Text>
      <NotImplemented {...(data as any)} />
    </Text>
  )
}

export default TasksPage
