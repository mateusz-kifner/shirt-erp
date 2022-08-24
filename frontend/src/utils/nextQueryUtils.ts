import type { NextRouter } from "next/router"

const setQuery = (
  router: NextRouter,
  query: {
    [key: string]: string | string[] | undefined
  }
) => {
  if (router.isReady) {
    router.replace({ pathname: router.asPath, query }, undefined, {
      shallow: true,
    })
  }
}

const getQueryAsArray = (router: NextRouter, key: string): string[] => {
  const query = router.query[key]

  if (Array.isArray(query)) return query

  if (typeof query === "string") return [query]

  return []
}

const getQueryAsInt = (router: NextRouter, key: string): number | null => {
  const query = router.query[key]
  if (Array.isArray(query)) {
    const queryAsInt = parseInt(query[0])
    return isNaN(queryAsInt) ? null : queryAsInt
  }
  if (typeof query === "string") {
    const queryAsInt = parseInt(query)
    return isNaN(queryAsInt) ? null : queryAsInt
  }
  return null
}

export { setQuery, getQueryAsArray, getQueryAsInt }
