import { useEffect, useState } from "react";

import {
  IconBug,
  IconLogout,
  IconMoonStars,
  IconSun,
  IconUserCircle,
} from "@tabler/icons-react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import SuperJSON from "superjson";

import Editable from "@/components/editable/Editable";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useUserContext } from "@/context/userContext";
import { useLoaded } from "@/hooks/useLoaded";
import { toast } from "@/hooks/useToast";
import useTranslation from "@/hooks/useTranslation";
import { sessionOptions } from "@/lib/session";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import template from "@/templates/test.template";
import { api } from "@/utils/api";
import { useLocalStorage } from "@mantine/hooks";

const testData = {
  name: "string",
  // bool: true,
  // switch: false,
  category: "option 1",
  color: "#ff0000",
  date: "2021-11-05T12:24:05.097Z",
  datetime: "2021-11-05T12:24:05.097Z",
  product: null,
  client: null,
  // productComponent: null,
  // productComponents: [],
  // image: null,
  // file: null,
  // files: null,
  // workstations: null,
  // employee: null,
  // employees: null,
  // submit: null,

  // group: { name: "test", color: "#ff0000" },
  // group2: { name: "test", color: "#ff0000" },
  // group3: { name: {}, color: "#ff0000" },
  // group_of_arrays: { arrayText: [], arrayText2: [] },
};

export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
  const user = req.session.user;

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: req.session },
    transformer: SuperJSON,
  });

  await ssg.session.user.prefetch();

  return {
    props: { trpcState: ssg.dehydrate() },
  };
}, sessionOptions);

function Settings() {
  const router = useRouter();
  const loaded = useLoaded();
  const { locale } = router;
  const { data } = api.session.user.useQuery();
  const logout = api.session.logout.useMutation({
    onSuccess() {
      void router.push("/profile");
    },
    onError(err) {
      console.log(err.message);
    },
  });
  const t = useTranslation();
  const { debug, toggleDebug, toggleTheme, theme } = useUserContext();
  const [testFormOpen, setTestFormOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [val, setVal] = useState<any>(null);
  const [testColor, setTestColor] = useState<string>("#fff");
  const [testValue, setTestValue] = useState<any>(testData);
  const [testDate, setTestDate] = useState<string | null>(
    "2021-11-05T12:24:05.097Z"
  );
  const { mutate } = api.client.create.useMutation();
  const [remSize, setRemSize] = useLocalStorage({
    key: "remSize",
    defaultValue: 10,
  });

  useEffect(() => {
    if (loaded) {
      const html = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
      html.style.fontSize = "" + remSize + "px";
    }
  }, [remSize]);

  if (!data?.user) return null;
  const user = data.user;

  const changeLocale = (value: string) => {
    router.push("", "", { locale: value }).catch((e) => {
      throw e;
    });
  };

  return (
    <div className="flex w-full flex-row items-start justify-center pb-12 pt-28 font-sans dark:text-gray-200">
      <div className="card mx-auto w-[36rem] bg-white shadow-xl dark:bg-stone-800">
        <IconUserCircle className="mx-auto -mt-20 h-32 w-32 rounded-full border-8 border-white bg-gray-200 stroke-slate-900 dark:border-stone-800  dark:bg-stone-800  dark:stroke-gray-200 " />
        <div className="mt-2 text-center text-3xl font-medium">
          {user?.name}
        </div>
        <hr className="mt-8 dark:border-stone-600 " />
        <div className="flex flex-col gap-3 p-4 ">
          <Button onClick={() => logout.mutate()} leftSection={<IconLogout />}>
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
            <Select
              data={["pl", "en"]}
              defaultValue={locale ?? "pl"}
              onValueChange={changeLocale}
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
              toggleDebug();
            }}
            leftSection={<IconBug />}
          >
            Debug {debug ? "ON" : "OFF"}
          </Button>
          {debug && (
            <>
              <Button
                onClick={() => {
                  setTestFormOpen(true);
                }}
                leftSection={<IconBug />}
              >
                Open Test Form
              </Button>

              <Button
                onClick={() => {
                  /**/
                  toast({ title: "test" });
                }}
                leftSection={<IconBug />}
              >
                show info
              </Button>
            </>
          )}
          <Editable
            data={testValue}
            template={template}
            onSubmit={(key, value) => {
              // @ts-ignore
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              setTestValue((val) => ({ ...val, [key]: value }));
              console.log(key, value);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Settings;
