import axios from "axios"
import Logger from "js-logger"

const download = (href: string, name?: string) => {
  if (typeof window === "undefined") return
  console.log(href)
  axios({
    url: href,
    method: "GET",
    responseType: "blob",
  })
    .then((response: any) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const file_name = response.config.url.split("/").pop()
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", name && name?.length > 0 ? name : file_name)
      document.body.appendChild(link)
      link.click()
      Logger.info({
        ...response,
        data: {},
        message:
          "Pobierano plik " + (name && name?.length > 0) ? name : file_name,
      })
    })
    .catch((err) => {
      Logger.error({ ...err, message: "błąd pobierania pliku" })
    })
}

export default download
