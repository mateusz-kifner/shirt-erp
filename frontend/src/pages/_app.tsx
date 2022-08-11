import { AppProps } from "next/app"
import Head from "next/head"
import "../styles/global.css"
import React from "react"
import AppLayout from "../components/layout/AppLayout"
import { QueryClient, QueryClientProvider } from "react-query"
import Logger from "js-logger"
import axios from "axios"
import { ReactQueryDevtools } from "react-query/devtools"
import { showNotification } from "@mantine/notifications"
import { serverURL } from "../env"
import UIProvider from "../components/layout/UIProvider"
import { AuthProvider } from "../context/authContext"
import { IconsProvider } from "../context/iconsContext"
import { ExperimentalFuturesProvider } from "../context/experimentalFuturesContext"

axios.defaults.baseURL = serverURL + "/api"

const queryClient = new QueryClient()

Logger.setHandler(function (messages, context) {
  const savedValue = localStorage.getItem("login")
  console.log(messages[0]?.message ?? "Nieznany błąd", messages[0])
  if (context.level === Logger.ERROR)
    showNotification({
      title: "Błąd",
      message:
        messages[0]?.message ??
        "Nieznany błąd: sprawdź szczegóły w logu servera",
      color: "red",
    })
  if (context.level === Logger.WARN)
    showNotification({
      title: "Ostrzeżenie",
      message:
        messages[0]?.message ??
        "Nieznany błąd: sprawdź szczegóły w logu servera",
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

export default function App(props: AppProps) {
  const { Component, pageProps } = props

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <AuthProvider>
        <IconsProvider>
          <ExperimentalFuturesProvider>
            <QueryClientProvider client={queryClient}>
              <UIProvider>
                <AppLayout>
                  <Component {...pageProps} />
                </AppLayout>
              </UIProvider>
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </ExperimentalFuturesProvider>
        </IconsProvider>
      </AuthProvider>
    </>
  )
}
