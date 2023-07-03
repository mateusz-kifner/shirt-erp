// import { message } from "antd"
import Logger from "js-logger"
import { showNotification } from "@mantine/notifications"

/**
 * Higher order function that logs status on execution
 */

const notify = (
  fn: ((...args: any[]) => any) | undefined,
  msg: string,
  status: "error" | "warn" | "success" | "info" | "debug" = "error"
) => {
  return (...args: any[]) => {
    // Exclue error and warn, because Logger is handling display of errors
    // ;(status == "info" || status == "success") && message[status](msg)
    ;(status == "info" || status == "success") &&
      localStorage.getItem("user-debug") === "true" &&
      showNotification({ title: status, message: msg, color: "green" })
    if (status == "success") status = "info"
    Logger[status]({ ...args, message: msg })

    if (fn) return fn(...args)
  }
}

export default notify
