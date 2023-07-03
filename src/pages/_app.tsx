import { type AppType } from "next/app";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Logger from "js-logger";
import Head from "next/head";

import ErrorBoundary from "@/components/ErrorBoundary";
import AppLayout from "@/components/layout/AppLayout";
import { UserContextProvider } from "@/context/userContext";
import { env } from "@/env.mjs";
import { api } from "@/utils/api";
import { TooltipProvider as RadixTooltipProvider } from "@radix-ui/react-tooltip";

import "@/styles/globals.css";

// dayjs imports
import dayjs from "dayjs";
import "dayjs/locale/pl";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

import { Toaster } from "@/components/ui/Toaster";
import { toast } from "@/hooks/useToast";
import isToday from "dayjs/plugin/isToday";
import { useRouter } from "next/router";
import { useEffect } from "react";

dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

// TODO: refactor logger

Logger.setHandler(function (messages, context) {
  console.log(messages);
  const savedValue = localStorage.getItem("user-data"); // TODO: log user id here
  console.log(messages[0]?.message ?? "Nieznany błąd", messages[0]);
  if (context.level === Logger.ERROR)
    if (context.level === Logger.WARN)
      toast({
        title: "Błąd",
        description:
          messages[0]?.message ??
          "Nieznany błąd: sprawdź szczegóły w logu serwera",
      });
  if (typeof messages[0] === "string") {
    toast({
      title: "Ostrzeżenie",
      // description:
      //   messages[0].message ??
      //   "Nieznany błąd: sprawdź szczegóły w logu serwera",
    });
    // axios.post("/logs", {
    //   message: messages[0],
    //   type: context.level.name,
    //   userId: savedValue && savedValue?.length > 0 ? savedValue : null,
    // });
  } else {
    // axios.post("/logs", {
    //   message: messages[0]?.message ? messages[0]?.message : "Nieznany błąd",
    //   data: messages[0],
    //   type: context.level.name,
    //   userId: savedValue && savedValue?.length > 0 ? savedValue : null,
    // });
  }
});

Logger.setLevel(
  env.NEXT_PUBLIC_NODE_ENV === "development" ? Logger.INFO : Logger.WARN
);

const App: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  dayjs.locale(router.locale);

  useEffect(() => {
    const remSize = localStorage.getItem("remSize");
    const html = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    html.style.fontSize = `${remSize}px`;
  }, []);

  return (
    <UserContextProvider>
      <RadixTooltipProvider>
        <AppLayout>
          <Head>
            <title>ShirtERP</title>
          </Head>
          <ErrorBoundary fallback={<h1>Application crashed</h1>}>
            <Component {...pageProps} />
          </ErrorBoundary>
        </AppLayout>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </RadixTooltipProvider>
    </UserContextProvider>
  );
};

export default api.withTRPC(App);
