import React from "react"
import { createRoot } from "react-dom/client"
import "./main.css"
import App from "./App"
import { QueryClient, QueryClientProvider } from "react-query"
import Logger from "js-logger"
import axios from "axios"
import { ReactQueryDevtools } from "react-query/devtools"
import { showNotification } from "@mantine/notifications"
import { RecoilRoot, useRecoilValue } from "recoil"
import { serverURL } from "./env"
//@ts-ignore
import { registerSW } from "virtual:pwa-register"

axios.defaults.baseURL = serverURL + "/api"

const queryClient = new QueryClient()

Logger.setHandler(function (messages, context) {
  const savedValue = localStorage.getItem("login")
  console.log(
    messages[0]?.message ? messages[0]?.message : "Nieznany błąd",
    messages[0]
  )
  if (context.level === Logger.ERROR)
    showNotification({
      title: "Błąd",
      message: messages[0]?.message
        ? messages[0]?.message
        : "Nieznany błąd: sprawdź szczegóły w logu servera",
      color: "red",
    })
  if (context.level === Logger.WARN)
    showNotification({
      title: "Ostrzeżenie",
      message: messages[0]?.message
        ? messages[0]?.message
        : "Nieznany błąd: sprawdź szczegóły w logu servera",
      color: "yellow",
    })
  if (typeof messages[0] === "string") {
    axios.post("/loggers", {
      message: messages[0],
      type: context.level.name,
      userId: savedValue && savedValue?.length > 0 ? savedValue : null,
    })
  } else {
    axios.post("/logs", {
      message: messages[0]?.message ? messages[0]?.message : "Nieznany błąd",
      data: messages[0],
      type: context.level.name,
      userId: savedValue && savedValue?.length > 0 ? savedValue : null,
    })
  }
})

Logger.setLevel(
  process.env.NODE_ENV === "development" ? Logger.INFO : Logger.WARN
)

const root = createRoot(document.getElementById("root")!)
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <React.Suspense fallback={<div>Loading...</div>}>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </React.Suspense>
    </RecoilRoot>
  </React.StrictMode>
)

registerSW({ immediate: true })
