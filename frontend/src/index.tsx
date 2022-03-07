import ReactDOM from "react-dom"
import { FC, useEffect } from "react"
import { ConfigProvider, message } from "antd"
import { RecoilRoot, useRecoilValue } from "recoil"
import reportWebVitals from "./reportWebVitals"
import plPL from "antd/lib/locale/pl_PL"
import { QueryClient, QueryClientProvider } from "react-query"

import axios from "axios"
import Logger from "js-logger"

import { loginState } from "./atoms/loginState"

import App from "./App"
import "./index.dark.css"

// this is fix for antd & date-fns incompatibility(https://github.com/ant-design/ant-design/issues/26699)
//@ts-ignore
plPL.DatePicker.lang.locale = "pl"

export const serverURL = (import.meta.env.SERVER_URL ||
  (function () {
    let origin_split = window.location.origin.split(":")
    return `${origin_split[0]}:${origin_split[1]}:1337/api`
  })()) as string

axios.defaults.baseURL = serverURL

const queryClient = new QueryClient()

Logger.setHandler(function (messages, context) {
  const savedValue = localStorage.getItem("login")
  console.log(
    messages[0]?.message ? messages[0]?.message : "Nieznany błąd",
    messages[0]
  )
  if (context.level === Logger.ERROR)
    message.error(
      messages[0]?.message
        ? messages[0]?.message
        : "Nieznany błąd: sprawdź szczegóły w logu servera"
    )
  if (context.level === Logger.WARN)
    message.warn(
      messages[0]?.message
        ? messages[0]?.message
        : "Nieznany błąd: sprawdź szczegóły w logu servera"
    )
  if (typeof messages[0] === "string") {
    axios.post("/loggers", {
      message: messages[0],
      type: context.level.name,
      user: savedValue && savedValue?.length > 0 ? savedValue : null,
    })
  } else {
    axios.post("/logs", {
      message: messages[0]?.message ? messages[0]?.message : "Nieznany błąd",
      data: messages[0],
      type: context.level.name,
      user: savedValue && savedValue?.length > 0 ? savedValue : null,
    })
  }
})

Logger.setLevel(
  process.env.NODE_ENV === "development" ? Logger.INFO : Logger.WARN
)

const ThemeProvider: FC = ({ children }) => {
  const login = useRecoilValue(loginState)
  const dark_theme = login.user !== null ? login.user.darkMode : true
  useEffect(() => {
    if (!dark_theme) {
      // require("./index.light.css");
      // require("antd/dist/antd.css");
    } else {
      // require("./index.dark.css");
      // require("antd/dist/antd.dark.css");
    }
    // require("./index.css");
  }, [dark_theme])

  return <>{children}</>
}

ReactDOM.render(
  // <React.StrictMode>
  <RecoilRoot>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={plPL}>
          <App />
        </ConfigProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </RecoilRoot>,
  // </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
