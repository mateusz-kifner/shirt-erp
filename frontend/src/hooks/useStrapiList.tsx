import axios from "axios"
import { useEffect } from "react"
import { useQuery, QueryClient } from "react-query"
import qs from "qs"

const queryClient = new QueryClient()

const fetchData = async (
  entryName: string | undefined,
  page: number | undefined,
  pageSize: number = 10
) => {
  if (!entryName) return
  if (!page) return
  const query = qs.stringify(
    {
      pagination: {
        page,
        pageSize,
      },
      populate: "*",
    },
    {
      encodeValuesOnly: true,
    }
  )
  const res = await axios.get(`/${entryName}?${query}`)
  return res.data
}

interface OptionsProps<EntryType> {
  pageSize: number
  queryOptions?: {
    cacheTime?: number
    enabled?: boolean
    initialData?: any
    initialDataUpdatedAt?: any
    isDataEqual?: any
    keepPreviousData?: any
    meta?: any
    notifyOnChangeProps?: any
    notifyOnChangePropsExclusions?: any
    onError?: ((err: unknown) => void) | undefined
    onSettled?: ((data: any, error: unknown) => void) | undefined
    onSuccess?: ((data: any) => void) | undefined
    placeholderData?: any
    queryKeyHashFn?: any
    refetchInterval?: any
    refetchIntervalInBackground?: any
    refetchOnMount?: any
    refetchOnReconnect?: any
    refetchOnWindowFocus?: any
    retry?: any
    retryOnMount?: any
    retryDelay?: any
    select?: any
    staleTime?: any
    structuralSharing?: any
    suspense?: any
    useErrorBoundary?: any
  }
}

function useStrapiList<EntryType>(
  entryName: string,
  page: number,
  options?: OptionsProps<EntryType>
) {
  const pageSize = options?.pageSize ?? 10
  const { data, status, refetch } = useQuery(
    [entryName, page, pageSize],
    () => fetchData(entryName, page, pageSize),
    { enabled: false, ...options?.queryOptions }
  )

  useEffect(() => {
    refetch()
  }, [page, pageSize])
  return { data: data?.data, meta: data?.meta, status, refetch }
}

export default useStrapiList
