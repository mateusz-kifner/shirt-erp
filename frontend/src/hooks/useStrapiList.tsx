import axios from "axios"
import { useEffect } from "react"
import { QueryKey, useQuery, UseQueryOptions } from "react-query"
import qs from "qs"

const fetchData = async <T = any,>(
  entryName?: string,
  page?: number,
  filterKeys?: string[],
  filterQuery?: string,
  sortOrder: "asc" | "desc" = "asc",
  pageSize: number = 10
): Promise<{ data: T; meta: any } | undefined> => {
  if (!entryName) return
  if (!page) return
  let query_obj: any = {
    pagination: {
      page,
      pageSize,
    },
    populate: "*",
    sort: ["updatedAt:" + sortOrder],
  }
  console.log(filterKeys, filterQuery)
  if (
    filterKeys &&
    filterKeys?.length > 0 &&
    filterQuery &&
    filterQuery.length > 0
  ) {
    let filters_or = []
    for (let key of filterKeys) {
      if (filterQuery && filterQuery.length > 0)
        filters_or.push({
          [key]: {
            $containsi: filterQuery,
          },
        })
    }
    console.log(filters_or)
    query_obj.filters = { $or: filters_or }
  }

  const query = qs.stringify(query_obj, {
    encodeValuesOnly: true,
  })
  console.log(query_obj, query)
  const res = await axios.get(`/${entryName}?${query}`)
  return res.data
}

function useStrapiList<entryType>(
  entryName: string,
  page: number,
  filterKeys?: string[],
  filterQuery?: string,
  sortOrder: "asc" | "desc" = "asc",
  options: {
    pageSize?: number
    queryOptions?: Omit<
      UseQueryOptions<
        any,
        unknown,
        { data: entryType; meta: any } | undefined,
        (string | number | string[] | undefined)[]
      >,
      "queryKey"
    >
  } = {}
) {
  const pageSize = options?.pageSize ?? 10
  const { data, status, refetch, isLoading } = useQuery<
    any,
    unknown,
    { data: entryType; meta: any } | undefined,
    (string | number | string[] | undefined)[]
  >(
    [entryName, page, filterKeys, filterQuery, sortOrder, pageSize],
    () =>
      fetchData(entryName, page, filterKeys, filterQuery, sortOrder, pageSize),
    { ...options?.queryOptions }
  )

  useEffect(() => {
    refetch()
  }, [page, pageSize])
  return {
    data: data && "data" in data ? data?.data : data,
    meta: data?.meta,
    status,
    refetch,
  }
}

export default useStrapiList
