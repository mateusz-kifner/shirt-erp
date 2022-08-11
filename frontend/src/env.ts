export const serverURL = (
  process.env.SERVER_URL && process.env.SERVER_PORT
    ? process.env.SERVER_URL + ":" + process.env.SERVER_PORT
    : (function () {
        if (typeof window === "undefined") {
          return "http://localhost:1337"
        }
        let origin_split = window.location.origin.split(":")
        return `${origin_split[0]}:${origin_split[1]}:${
          process.env.SERVER_PORT || 1337
        }`
      })()
) as string
