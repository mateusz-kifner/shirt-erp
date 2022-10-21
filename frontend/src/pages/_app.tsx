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
import UIProvider from "../components/layout/UIProvider"
import { AuthProvider } from "../context/authContext"
import { IconsProvider } from "../context/iconsContext"
import { ExperimentalFuturesProvider } from "../context/experimentalFuturesContext"
import { env } from "../env/client.mjs"

import "dayjs/locale/pl"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import isToday from "dayjs/plugin/isToday"

import i18n from "../i18n"
import i18next from "i18next"

axios.defaults.baseURL = env.NEXT_PUBLIC_SERVER_API_URL + "/api"

const queryClient = new QueryClient()

Logger.setHandler(function (messages, context) {
  const savedValue = localStorage.getItem("user-data")
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
  env.NEXT_PUBLIC_NODE_ENV === "development" ? Logger.INFO : Logger.WARN
)

//wait for i18n initialization to get current locale
i18n.then(() => {
  dayjs.locale(i18next.language)
})
dayjs.extend(localizedFormat)
dayjs.extend(isToday)

export default function App(props: AppProps) {
  const { Component, pageProps } = props

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="theme-color" content="#1f1f1f" />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="ShirtERP system" />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/shirterp-192x192.png"
        />

        <link
          rel="manifest"
          href="/manifest.webmanifest"
          crossOrigin="use-credentials"
        />

        <title>ShirtERP</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <IconsProvider>
            <ExperimentalFuturesProvider>
              <UIProvider>
                <AppLayout>
                  <Component {...pageProps} />
                </AppLayout>
              </UIProvider>
            </ExperimentalFuturesProvider>
          </IconsProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}
