import { useEffect, useId, useState } from "react";

import Button, { buttonVariants } from "@/components/ui/Button";
import { useUserContext } from "@/context/userContext";
import { env } from "@/env.mjs";
import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";

import { trpc } from "@/utils/trpc";
import { useLocalStorage } from "@mantine/hooks";
import {
  IconBug,
  IconCalendar,
  IconLogout,
  IconMail,
  IconMoonStars,
  IconSettings,
  IconSun,
  IconUserCircle,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { useExperimentalContext } from "@/context/experimentalContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { useFlagContext } from "@/context/flagContext";

// export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
//   const user = req.session.user;

//   if (!user) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   const ssg = createServerSideHelpers({
//     router: appRouter,
//     ctx: { session: req.session, db },
//     transformer: SuperJSON,
//   });

//   await ssg.session.me.prefetch();

//   return {
//     props: { trpcState: ssg.dehydrate() },
//   };
// }, sessionOptions);

function Settings() {
  const router = useRouter();
  const loaded = useLoaded();
  const uuid = useId();
  const { data: session } = useSession();
  const { locale } = router;
  const { data: userData } = trpc.session.me.useQuery();
  const t = useTranslation();
  const { debug, toggleDebug, toggleTheme, theme } = useUserContext();
  const [remSize, setRemSize] = useLocalStorage({
    key: "remSize",
    defaultValue: 10,
  });
  const [demoVal, setDemoVal] = useState({ test: "test", date: "" });

  const { toggleExtendedList, extendedList } = useExperimentalContext();
  const {
    editableAddressMode,
    setEditableAddressMode,
    setMobileOverride,
    mobileOverride,
    calendarDefaultClick,
    setCalendarDefaultClick,
    calendarDefaultViewMode,
    setCalendarDefaultViewMode,
    calendarDefaultDataSource,
    setCalendarDefaultDataSource,
  } = useFlagContext();

  useEffect(() => {
    if (loaded) {
      const html = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
      html.style.fontSize = "" + remSize + "px";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remSize]);

  if (!userData) return null;
  const changeLocale = (value: string) => {
    void router.push("", "", { locale: value });
  };

  return (
    <div className="flex w-full flex-row items-start justify-center pb-12 pt-28 font-sans dark:text-gray-200">
      <div className="card mx-auto w-[36rem] bg-white shadow-xl dark:bg-stone-800">
        <IconUserCircle className="mx-auto -mt-20 h-32 w-32 rounded-full border-8 border-white bg-gray-200 stroke-slate-900 dark:border-stone-800  dark:bg-stone-800  dark:stroke-gray-200 " />
        <div className="mt-2 text-center text-3xl font-medium">
          {userData?.name}
        </div>
        <hr className="mt-8 dark:border-stone-600 " />
        <div className="flex flex-col gap-3 p-4 ">
          <Button
            onClick={() => {
              void signOut();
              // logout
              //   .mutateAsync()
              //   .then(() => {
              //     // void router.push("/login");
              //   })
              //   .catch((err: { message: string }) => console.log(err.message));
            }}
            leftSection={<IconLogout />}
          >
            {t.sign_out}
          </Button>
          <div className="flex flex-grow items-center gap-2">
            <span className="flex-grow">{t.zoom}</span>
            <Button
              onClick={() => setRemSize(10)}
              className="w-8"
              disabled={remSize === 10}
            >
              -3
            </Button>
            <Button
              onClick={() => setRemSize(12)}
              className="w-8"
              disabled={remSize === 12}
            >
              -2
            </Button>
            <Button
              onClick={() => setRemSize(14)}
              className="w-8"
              disabled={remSize === 14}
            >
              -1
            </Button>
            <Button
              onClick={() => setRemSize(16)}
              className="w-8"
              disabled={remSize === 16}
            >
              0
            </Button>
            <Button
              onClick={() => setRemSize(18)}
              className="w-8"
              disabled={remSize === 18}
            >
              1
            </Button>
            <Button
              onClick={() => setRemSize(20)}
              className="w-8"
              disabled={remSize === 20}
            >
              2
            </Button>
            <Button
              onClick={() => setRemSize(22)}
              className="w-8"
              disabled={remSize === 22}
            >
              3
            </Button>
          </div>
          <div className="flex items-center justify-stretch">
            <span className="w-1/2">{t.language}</span>
            <Select
              value={locale ?? "pl"}
              onValueChange={changeLocale}
              disabled={true}
            >
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder={`${t.select} ...`} />
              </SelectTrigger>
              <SelectContent>
                {["pl", "en"].map((val, index) => (
                  <SelectItem value={val} key={`${uuid}:${index}`}>
                    {(t[val as keyof typeof t] as string | undefined) ?? val}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={toggleTheme}
            leftSection={theme === 1 ? <IconSun /> : <IconMoonStars />}
          >
            {theme === 1 ? t.light_theme : t.dark_theme}
          </Button>

          <Button
            onClick={() => {
              router.push("settings/email-credentials").catch(console.log);
            }}
            leftSection={<IconMail />}
          >
            <p className="first-letter:uppercase">
              {t.emailMessage.singular} {t.credentials}
            </p>
          </Button>
          {!env.NEXT_PUBLIC_DEMO && (
            <Button
              onClick={() => {
                toggleDebug();
              }}
              leftSection={<IconBug />}
            >
              Debug {debug ? "ON" : "OFF"}
            </Button>
          )}
          {(session?.user.role === "manager" ||
            session?.user.role === "admin") && (
            <>
              <Button
                onClick={() => {
                  void router.push("user");
                }}
                leftSection={<IconUser />}
              >
                <span className="capitalize"> {t.manage}</span>
                {t.user.plural}
              </Button>
              <Button
                onClick={() => {
                  void router.push("/erp/global-properties");
                }}
                leftSection={<IconSettings />}
              >
                {t.globalProperty.plural}
              </Button>
            </>
          )}

          <Button
            onClick={() => {
              setMobileOverride((prev) =>
                prev === "auto"
                  ? "mobile"
                  : prev === "mobile"
                    ? "desktop"
                    : "auto",
              );
            }}
            leftSection={<IconBug />}
          >
            Mobile mode: {mobileOverride}
          </Button>
          <Button
            onClick={() => {
              setCalendarDefaultClick((prev) =>
                prev === "order" ? "task" : "order",
              );
            }}
            leftSection={<IconCalendar />}
          >
            Calendar order link: {calendarDefaultClick}
          </Button>
          <Button
            onClick={() => {
              setCalendarDefaultViewMode((prev) =>
                prev === "month" ? "week" : "month",
              );
            }}
            leftSection={<IconCalendar />}
          >
            Calendar default view mode: {calendarDefaultViewMode}
          </Button>
          <Button
            onClick={() => {
              setCalendarDefaultDataSource((prev) =>
                prev === "all" ? "user" : "all",
              );
            }}
            leftSection={<IconCalendar />}
          >
            Calendar default data source: {calendarDefaultDataSource}
          </Button>
          {debug && (
            <>
              <Button
                onClick={() => {
                  setEditableAddressMode((prev) =>
                    prev === "popup"
                      ? "always_visible"
                      : prev === "always_visible"
                        ? "extend"
                        : "popup",
                  );
                }}
                leftSection={<IconBug />}
              >
                Address input mode: {editableAddressMode}
              </Button>

              <Button
                onClick={() => {
                  toggleExtendedList();
                }}
                leftSection={<IconBug />}
              >
                ExtendedList {extendedList ? "ON" : "OFF"}
              </Button>
              <div className="flex gap-2">
                <Link
                  className={buttonVariants({ className: "w-1/3" })}
                  href="/erp/settings/colors"
                >
                  Test Colors
                </Link>
                <Link
                  className={buttonVariants({ className: "w-1/3" })}
                  href="/erp/settings/shadcn"
                >
                  Test Basic UI
                </Link>
                <Link
                  className={buttonVariants({ className: "w-1/3" })}
                  href="/erp/settings/editable"
                >
                  Test Form UI
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
