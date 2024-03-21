/* eslint-disable @typescript-eslint/no-explicit-any */
import Logger from "js-logger";
import { toast } from "sonner";

// TODO remove this and add proper logger

// import { showNotification } from "@/lib/notifications";

/**
 * Higher order function that logs status on execution
 */

const notify = (
  fn: ((...args: any[]) => any) | undefined,
  msg: string,
  status: "error" | "warn" | "success" | "info" | "debug" = "error",
) => {
  let s = status;
  return (...args: any[]) => {
    // Exclue error and warn, because Logger is handling display of errors
    // ;(status == "info" || status == "success") && message[status](msg)
    if (
      (s === "info" || s === "success") &&
      localStorage.getItem("user-debug") === "true"
    ) {
      toast(s, {
        description: msg,
      });
    }
    if (s === "success") s = "info";
    Logger[s]({ ...args, message: msg });

    if (fn) return fn(...args);
  };
};

export default notify;
