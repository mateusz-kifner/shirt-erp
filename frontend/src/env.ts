export const serverURL = (import.meta.env.VITE_SERVER_URL ||
  (function () {
    let origin_split = window.location.origin.split(":")
    return `${origin_split[0]}:${origin_split[1]}:${
      import.meta.env.VITE_SERVER_URL || 1337
    }`
  })()) as string
