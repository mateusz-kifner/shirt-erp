import type { AppType } from "next/app";

import "@total-typescript/ts-reset";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Logger from "js-logger";
import Head from "next/head";

import { UserContextProvider } from "@/context/userContext";
import { ExperimentalContextProvider } from "@/context/experimentalContext";
import { env } from "@/env";
import { trpc } from "@/utils/trpc";

import "@/styles/globals.css";

// dayjs imports
import dayjs from "dayjs";
import "dayjs/locale/pl";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import localeData from "dayjs/plugin/localeData";

import { TooltipProvider } from "@/components/ui/Tooltip";
import isToday from "dayjs/plugin/isToday";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import LayoutAuth from "@/components/layout/LayoutAuth";
import LayoutERP from "@/components/layout/LayoutERP";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/Sonner";
import { FlagContextProvider } from "@/context/flagContext";

dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(localeData);

// TODO: refactor logger

if (typeof window !== "undefined") {
  Logger.setHandler((messages, context) => {
    console.log(messages);
    const savedValue = localStorage.getItem("user-data"); // TODO: log user id here
    console.log(messages[0]?.message ?? "Nieznany błąd", messages[0]);
    if (context.level === Logger.ERROR)
      if (context.level === Logger.WARN)
        toast.message("Błąd", {
          description:
            messages[0]?.message ??
            "Nieznany błąd: sprawdź szczegóły w logu serwera",
        });

    if (typeof messages[0] === "string") {
      toast("Warn", {
        description: "Ostrzeżenie",
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
}

Logger.setLevel(
  env.NEXT_PUBLIC_NODE_ENV === "development" ? Logger.INFO : Logger.WARN,
);

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps,
}) => {
  const { session } = pageProps;
  const router = useRouter();
  dayjs.locale(router.locale);

  useEffect(() => {
    const remSize = localStorage.getItem("remSize");
    const html = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    html.style.fontSize = `${remSize}px`;

    // initialize theme
    const theme = localStorage.getItem("user-theme");
    const htmlElement = document.querySelector("html") as HTMLHtmlElement;
    htmlElement.classList.add(theme === "0" ? "light" : "dark");

    // enable transitions after page load
    const timeout = setTimeout(() => {
      const bodyElement = document.querySelector("body") as HTMLBodyElement;
      bodyElement.classList.remove("preload");
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  const changeLocale = (value: string) => {
    void router.push("/", "/", { locale: value });
  };

  // force Polish for now
  useEffect(() => {
    if (router.locale !== "pl") changeLocale("pl");
  }, [router.locale, changeLocale]);

  const Layout =
    !router.pathname.startsWith("/erp") || router.query["no-ui"] === "1"
      ? LayoutAuth
      : LayoutERP;

  return (
    <SessionProvider session={session}>
      <FlagContextProvider>
        <ExperimentalContextProvider>
          <UserContextProvider>
            <TooltipProvider>
              <Layout>
                <Head>
                  <title>ShirtERP</title>
                </Head>
                <ErrorBoundary fallback={<h1>Application crashed</h1>}>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </Layout>
              <Toaster />
              <ReactQueryDevtools initialIsOpen={false} />
            </TooltipProvider>
          </UserContextProvider>
        </ExperimentalContextProvider>
      </FlagContextProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);
