/* eslint-disable @typescript-eslint/no-explicit-any */
import Logger from "js-logger";
import { toast } from "sonner";

// import { showNotification } from "@/lib/notifications";

/**
 * Higher order function that logs status on execution
 */

const notify = (
  fn: ((...args: any[]) => any) | undefined,
  msg: string,
  status: "error" | "warn" | "success" | "info" | "debug" = "error",
) => {
  return (...args: any[]) => {
    // Exclue error and warn, because Logger is handling display of errors
    // ;(status == "info" || status == "success") && message[status](msg)
    if (
      (status == "info" || status == "success") &&
      localStorage.getItem("user-debug") === "true"
    ) {
      toast(status, {
        description: msg,
      });
    }
    if (status == "success") status = "info";
    Logger[status]({ ...args, message: msg });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
    if (fn) return fn(...args);
  };
};

export default notify;
