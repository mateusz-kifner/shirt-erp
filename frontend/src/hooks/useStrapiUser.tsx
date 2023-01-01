import axios from "axios"
import { UseMutationOptions, useQuery, UseQueryOptions } from "react-query"
import { useAuthContext } from "../context/authContext"
import { UserType } from "../types/UserType"

// TODO: Add user mutation

const fetchData = async (entryName?: string | null) => {
  if (!entryName) return
  const res = await axios.get(`/${entryName}?populate=%2A`)
  return res.data
}

interface OptionsProps {
  queryOptions?: Omit<
    UseQueryOptions<any, unknown, UserType | undefined, string>,
    "queryKey" | "queryFn"
  >
  updateMutationOptions?: {
    errorMessage?: string
    successMessage?: string
  } & Omit<UseMutationOptions<any, unknown, any, unknown>, "mutationFn">
}

function useStarpiUser(options?: OptionsProps) {
  const { signOut } = useAuthContext()
  const query = useQuery(
    "users" as string,
    () => fetchData("users/me"),

    {
      ...options?.queryOptions,
      refetchInterval: 300000,
    }
  )
  // signOut if auth failed
  query.isError && (query.error as any)?.response?.status === 401 && signOut()

  return query
}

export default useStarpiUser
