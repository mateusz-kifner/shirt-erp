import { useEffect, useId, useState } from "react";

import Button, { buttonVariants } from "@shirterp/ui-web/Button";
import { useUserContext } from "@/context/userContext";
import { env } from "@/env";
import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";

import { trpc } from "@/utils/trpc";
import { useLocalStorage } from "@mantine/hooks";
import {
  IconBug,
  IconCalendar,
  IconLogout,
  IconMail,
  IconMenu2,
  IconMoonStars,
  IconSettings,
  IconSun,
  IconUserCircle,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { signOut, useSession } from "@shirterp/auth/react";
import { useExperimentalContext } from "@/context/experimentalContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shirterp/ui-web/Select";
import { IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { useFlag } from "@/hooks/useFlag";
import FlagSettings from "@/components/Flags/FlagSettings";
import FlagSettingBoolean from "@/components/Flags/FlagSettingBoolean";
import FlagSettingEnum from "@/components/Flags/FlagSettingEnum";
import FlagSettingString from "@/components/Flags/FlagSettingString";

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
  const [demoVal, setDemoVal] = useState({ test: "test", date: "" });

  const { toggleExtendedList, extendedList } = useExperimentalContext();
  const { flags: rootFlags, toggle: rootToggle } = useFlag("root");

  const [test, setTest] = useState(0);

  trpc.settings.randomNumber.useSubscription(undefined, {
    onData(data) {
      setTest(data);
    },
  });

  useEffect(() => {
    if (loaded && typeof rootFlags?.zoom_level === "string") {
      const html = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
      const zoom_level = Number.parseInt(rootFlags.zoom_level) ?? 0;
      html.style.fontSize = `${16 + zoom_level * 2}px`;
    }
  }, [rootFlags?.zoom_level]);

  if (!userData) {
    return (
      <div className="flex w-full flex-row items-start justify-center pt-28 pb-12 font-sans dark:text-gray-200">
        <div className="card mx-auto w-[36rem] bg-white shadow-xl dark:bg-stone-800">
          <IconUserCircle className="-mt-20 mx-auto h-32 w-32 rounded-full border-8 border-white bg-gray-200 stroke-slate-900 dark:border-stone-800 dark:bg-stone-800 dark:stroke-gray-200" />
          <hr className="mt-8 dark:border-stone-600" />
          <div className="flex flex-col gap-3 p-4">
            <Button
              onClick={() => {
                void signOut();
              }}
              leftSection={<IconLogout />}
            >
              {t.sign_out}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const changeLocale = (value: string) => {
    void router.push("", "", { locale: value });
  };

  return (
    <div className="flex w-full flex-row items-start justify-center pt-28 pb-12 font-sans dark:text-gray-200">
      <div className="card mx-auto w-[36rem] bg-white shadow-xl dark:bg-stone-800">
        <IconUserCircle className="-mt-20 mx-auto h-32 w-32 rounded-full border-8 border-white bg-gray-200 stroke-slate-900 dark:border-stone-800 dark:bg-stone-800 dark:stroke-gray-200" />
        <div className="mt-2 text-center font-medium text-3xl">
          {userData?.name}
        </div>
        <hr className="mt-8 dark:border-stone-600" />
        <div className="flex flex-col gap-3 p-4">
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

          <div className="flex flex-col gap-3 pb-3">
            <h3 className="font-bold">Opcje nawigacji</h3>

            <FlagSettings
              group="navigation"
              className="pl-2"
              BooleanComponent={FlagSettingBoolean}
              EnumComponent={FlagSettingEnum}
              StringComponent={FlagSettingString}
            />
          </div>
          <div className="flex flex-col gap-3 pb-3">
            <h3 className="font-bold">Opcje kalendarza</h3>

            <FlagSettings
              group="calendar"
              className="pl-2"
              BooleanComponent={FlagSettingBoolean}
              EnumComponent={FlagSettingEnum}
              StringComponent={FlagSettingString}
            />
          </div>
          <div className="flex flex-col gap-3 pb-3">
            <h3 className="font-bold">Opcje inne</h3>
            <FlagSettings
              group="root"
              className="pl-2"
              BooleanComponent={FlagSettingBoolean}
              EnumComponent={FlagSettingEnum}
              StringComponent={FlagSettingString}
            />
          </div>
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
          {debug && (
            <>
              <Button
                onClick={() => {
                  rootToggle("editable_address_mode");
                  // setEditableAddressMode((prev) =>
                  //   prev === "popup"
                  //     ? "always_visible"
                  //     : prev === "always_visible"
                  //       ? "extend"
                  //       : "popup",
                  // );
                }}
                leftSection={<IconBug />}
              >
                Address input mode: {rootFlags?.editable_address_mode}
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
              <div>{test}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
