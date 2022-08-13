import axios from "axios"
import { useEffect } from "react"
import {
  useMutation,
  useQuery,
  QueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "react-query"
import notify from "../utils/notify"

const queryClient = new QueryClient()

// TODO: Add proper optimisticUpdate

const fetchData = async (
  entryName?: string | null,
  id?: number | null,
  query?: string
) => {
  if (!id) return
  if (!entryName) return
  const res = await axios.get(
    `/${entryName}/${id}${query && query.length > 0 ? "?" + query : ""}`
  )
  return res.data
}

const addEntry = async (entryName?: string | null, data?: any | null) => {
  if (!data) return
  if (!entryName) return
  const res = await axios.post(`/${entryName}`, data)
  console.log(res)
  return res.data
}

const removeEntry = async (entryName?: string | null, id?: number | null) => {
  if (!id) return
  if (!entryName) return
  const res = await axios.delete(`/${entryName}/${id}`)
  return res.data
}

const updateEntry = async (
  entryName?: string | null,
  id?: number | null,
  data?: any | null
) => {
  if (!data) return
  if (!entryName) return
  if (!id) return
  const res = await axios.put(`/${entryName}/${id}`, data)
  return res.data
}

interface OptionsProps<EntryType> {
  query: string
  queryOptions?: Omit<
    UseQueryOptions<
      any,
      unknown,
      { data: EntryType; meta: any } | undefined,
      (string | number | null | undefined)[]
    >,
    "queryKey" | "queryFn"
  >
  addMutationOptions?: {
    errorMessage?: string
    successMessage?: string
  } & Omit<UseMutationOptions<any, unknown, any, unknown>, "mutationFn">

  removeMutationOptions?: {
    errorMessage?: string
    successMessage?: string
  } & Omit<UseMutationOptions<any, unknown, any, unknown>, "mutationFn">
  updateMutationOptions?: {
    errorMessage?: string
    successMessage?: string
  } & Omit<UseMutationOptions<any, unknown, any, unknown>, "mutationFn">
}

function useStrapi<EntryType>(
  entryName: string,
  id?: number | null,
  options?: OptionsProps<EntryType>
) {
  const { data, status, refetch } = useQuery(
    [entryName + "_one", id, options?.query],
    () => fetchData(entryName, id, options?.query),
    { enabled: false, ...options?.queryOptions }
  )

  useEffect(() => {
    refetch()
  }, [id])

  const optimisticUpdate = (fn: ((...args: any[]) => any) | undefined) => {
    return (...args: any[]) => {
      refetch()
      if (fn) return fn(...args)
    }
  }

  const addMutation = useMutation(
    (addData: { data: EntryType }) => {
      console.log(addData, entryName)
      return addEntry(entryName, addData)
    },
    {
      onError: notify(
        options?.addMutationOptions?.onError,
        options?.addMutationOptions?.errorMessage
          ? options.addMutationOptions.errorMessage
          : "Błąd dodawania elementu"
      ),
      onMutate: options?.addMutationOptions?.onMutate,
      onSettled: options?.addMutationOptions?.onSettled,
      onSuccess: notify(
        optimisticUpdate(options?.addMutationOptions?.onSuccess),
        options?.addMutationOptions?.successMessage
          ? options.addMutationOptions.successMessage
          : "Dodanie elementu udane",
        "success"
      ),
    }
  )
  const removeMutation = useMutation(() => removeEntry(entryName, id), {
    onError: notify(
      options?.removeMutationOptions?.onError,
      options?.removeMutationOptions?.errorMessage
        ? options.removeMutationOptions.errorMessage
        : "Błąd usuwania elementu"
    ),
    onMutate: options?.removeMutationOptions?.onMutate,
    onSettled: options?.removeMutationOptions?.onSettled,
    onSuccess: notify(
      options?.removeMutationOptions?.onSuccess,
      options?.removeMutationOptions?.successMessage
        ? options.removeMutationOptions.successMessage
        : "Usunięcie elementu udane",
      "success"
    ),
  })

  const updateMutation = useMutation(
    (updateData: { data: EntryType }) => updateEntry(entryName, id, updateData),
    {
      onError: notify(
        options?.updateMutationOptions?.onError,
        options?.updateMutationOptions?.errorMessage
          ? options.updateMutationOptions.errorMessage
          : "Błąd edycji elementu"
      ),
      onMutate: options?.updateMutationOptions?.onMutate,
      onSettled: options?.updateMutationOptions?.onSettled,
      onSuccess: notify(
        optimisticUpdate(options?.updateMutationOptions?.onSuccess),
        options?.updateMutationOptions?.successMessage
          ? options.updateMutationOptions.successMessage
          : "Edycja elementu udana",
        "success"
      ),
    }
  )

  async function add(entry: EntryType) {
    console.log("add Strapi api entry:", entry, entryName)
    addMutation.mutateAsync({ data: entry })
  }
  async function update(entry: EntryType) {
    updateMutation.mutateAsync({ data: entry })
  }
  async function remove(id?: number) {
    removeMutation.mutateAsync(undefined, {
      onSuccess: () => {
        queryClient.setQueryData([entryName + "_one", id], null)
        queryClient.removeQueries([entryName + "_one", id])
      },
    })
  }
  return {
    data: data?.data,
    meta: data?.meta,
    status,
    refetch,
    add,
    update,
    remove,
  }
}

export default useStrapi
