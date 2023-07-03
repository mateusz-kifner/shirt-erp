import type { NextRouter } from "next/router";

/** next router helper functions for managing query params */

/**
 * function sets query params
 */

const setQuery = (
  router: NextRouter,
  query: {
    [key: string]: string | string[] | number | number[] | undefined;
  }
) => {
  if (router.isReady) {
    const new_query: { [key: string]: string } = {};
    for (const key in query) {
      const elem = query[key];
      new_query[key] = Array.isArray(elem)
        ? elem.length !== 0
          ? (elem as any[]).reduce(
              (
                prev: string,
                next: string | number,
                index: number,
                arr: (string | number)[]
              ) => prev + next.toString() + (index < arr.length - 1 ? "," : ""),
              ""
            )
          : ""
        : elem?.toString();
    }
    router
      .replace(
        { pathname: router.asPath.split("?")[0], query: new_query },
        undefined,
        {
          shallow: true,
        }
      )
      .catch((err) => console.log(err));
  }
};

/**
 * Function that returns query parameter with given key as array.
 * if key doesn't exists empty array is returned
 */
const getQueryAsArray = (router: NextRouter, key: string): string[] => {
  const query = router.query[key];

  if (Array.isArray(query)) return query;

  if (typeof query === "string") {
    if (query.includes(",")) {
      return query.split(",");
    } else {
      return [query];
    }
  }

  return [];
};

/**
 * Function that returns query parameter with given key as int, if there are many elements with given key first is returned
 * if key doesn't exists or isNaN null is returned
 */
const getQueryAsIntOrNull = (
  router: NextRouter,
  key: string
): number | null => {
  const query = router.query[key];
  if (Array.isArray(query)) {
    if (query[0] === undefined) return null;
    const queryAsInt = parseInt(query[0]);
    return isNaN(queryAsInt) ? null : queryAsInt;
  }
  if (typeof query === "string") {
    const queryAsInt = parseInt(query);
    return isNaN(queryAsInt) ? null : queryAsInt;
  }
  return null;
};

/**
 * Function that returns query parameter with given key as int, if there are many elements with given key first is returned
 * if key doesn't exists 0 is returned
 */
const getQueryAsInt = (router: NextRouter, key: string): number =>
  getQueryAsIntOrNull(router, key) ?? 0;

/**
 * Function that returns query parameter with given key as string, if there are many elements with given key first is returned
 * if key doesn't exists empty string is returned
 */
const getQueryAsString = (router: NextRouter, key: string): string => {
  const query = router.query[key];
  if (Array.isArray(query)) {
    if (query[0] === undefined) return "";
    return query[0];
  }
  if (typeof query === "string") {
    return query;
  }
  return "";
};
/**
 * Function that returns query parameter with given key as string, if there are many elements with given key first is returned
 * if key doesn't exists or string is empty null is returned
 */
const getQueryAsStringOrNull = (
  router: NextRouter,
  key: string
): string | null => {
  const query = router.query[key];
  if (Array.isArray(query)) {
    return query[0] !== undefined && query[0].length > 0 ? query[0] : null;
  }
  if (typeof query === "string") {
    return query.length > 0 ? query : null;
  }
  return null;
};

export {
  setQuery,
  getQueryAsArray,
  getQueryAsInt,
  getQueryAsIntOrNull,
  getQueryAsString,
  getQueryAsStringOrNull,
};
