import axios from "axios"
import { useQuery } from "react-query"
import { UserType } from "../types/UserType"

const fetchData = async (entryName?: string | null) => {
  if (!entryName) return
  const res = await axios.get(`/${entryName}?populate=%2A`)
  return res.data
}

function useStarpiUser() {
  return useQuery<UserType>("users", () => fetchData("users/me"), {
    refetchInterval: 300000,
  })
}

export default useStarpiUser
