import { useEffect } from "react";
import EditableEnum from "@/components/editable/EditableEnum";
import Button from "@/components/ui/Button";
import { useUserContext } from "@/context/userContext";
import { env } from "@/env.mjs";
import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";
import { api } from "@/utils/api";
import { useLocalStorage } from "@mantine/hooks";
import {
  IconBug,
  IconLogout,
  IconMail,
  IconMoonStars,
  IconSun,
  IconUserCircle,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

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
export function Settings() {
  const router = useRouter();
  const loaded = useLoaded();
  // const { locale } = router;
  const { data: userData } = api.session.me.useQuery();
  const t = useTranslation();
  const { debug, toggleDebug, toggleTheme, theme } = useUserContext();
  const [remSize, setRemSize] = useLocalStorage({
    key: "remSize",
    defaultValue: 10,
  });

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
              signOut();
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
            <Button onClick={() => setRemSize(12)} className="w-12">
              -2
            </Button>
            <Button onClick={() => setRemSize(14)} className="w-12">
              -1
            </Button>
            <Button onClick={() => setRemSize(16)} className="w-12">
              0
            </Button>
            <Button onClick={() => setRemSize(18)} className="w-12">
              1
            </Button>
            <Button onClick={() => setRemSize(20)} className="w-12">
              2
            </Button>
          </div>
          <div className="flex items-center justify-stretch">
            <span className="w-1/2">{t.language}</span>
            <EditableEnum
              enum_data={["pl", "en"]}
              // defaultValue={locale ?? "pl"}
              defaultValue={"pl"}
              onValueChange={changeLocale}
              disabled
            />
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
              {t["email-message"].singular} {t.credentials}
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
          {debug && <></>}
        </div>
      </div>
    </div>
  );
}
