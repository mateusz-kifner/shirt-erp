import { useState, type FormEvent } from "react";

import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { env } from "@/env.mjs";
import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";
import { sessionOptions } from "@/server/session";
import { api } from "@/utils/api";

export default function Login() {
  const router = useRouter();
  const t = useTranslation();
  const isLoaded = useLoaded();

  const login = api.session.login.useMutation({
    onSuccess() {
      void router.push("/erp/task");
    },
    onError(err) {
      setErrorMsg(t.error_sign_in);
    },
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    };
    login.mutate(body);
  };

  console.log(env.NEXT_PUBLIC_DEMO);

  return (
    <Dialog open={isLoaded}>
      <DialogContent disableClose>
        <DialogTitle>{t.sign_in}</DialogTitle>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-4 px-2 pb-8 pt-2">
            <div className="h-7  text-red-700 dark:text-red-400">
              {!!errorMsg ? errorMsg : ` `}
            </div>
            <input
              name="username"
              className="
                h-11
                max-h-screen
                w-full
                resize-none
                gap-2
                overflow-hidden
                whitespace-pre-line 
                break-words
                rounded-md 
                border
                border-solid
                border-gray-400
                bg-white 
                p-4
                px-6
                text-base
                leading-normal
                outline-none
                read-only:bg-transparent 
                read-only:outline-none 
                focus:border-sky-600
                disabled:text-gray-500
                dark:border-stone-600
                dark:bg-stone-800 
                dark:outline-none 
                dark:read-only:bg-transparent 
                dark:read-only:outline-none
                dark:focus:border-sky-600
                dark:disabled:text-gray-500
                "
              type="text"
              placeholder={t.username}
              defaultValue={env.NEXT_PUBLIC_DEMO ? "testuser" : undefined}
              disabled={env.NEXT_PUBLIC_DEMO}
            />
            <input
              name="password"
              className="
             
                h-11 
                max-h-screen
                w-full
                resize-none
                gap-2
                overflow-hidden
                whitespace-pre-line 
                break-words
                rounded-md 
                border
                border-solid
                border-gray-400
                bg-white 
                p-4
                px-6
                text-base
                leading-normal
                outline-none
                read-only:bg-transparent 
                read-only:outline-none 
                focus:border-sky-600
                disabled:text-gray-500
                dark:border-stone-600
                dark:bg-stone-800
                dark:outline-none 
                dark:read-only:bg-transparent 
                dark:read-only:outline-none 
                dark:focus:border-sky-600
                dark:disabled:text-gray-500"
              type="password"
              placeholder={t.password}
              defaultValue={env.NEXT_PUBLIC_DEMO ? "testuser" : undefined}
              disabled={env.NEXT_PUBLIC_DEMO}
            />
            <input
              className={`
            border-1
              mt-8 
              inline-flex
              h-10
              animate-pop 
              select-none 
              items-center 
              justify-center 
              gap-3
              rounded-md
              bg-blue-600
              stroke-gray-200 
              px-4 py-0 
              font-semibold 
              uppercase 
              text-gray-200
              no-underline 
              outline-offset-4
              transition-all  
              hover:bg-blue-700 
              focus-visible:outline-sky-600 
              active:hover:scale-95 
              active:hover:animate-none 
              active:focus:scale-95 
              active:focus:animate-none 
              disabled:pointer-events-none 
              disabled:bg-stone-700`}
              type="submit"
              value={t.sign_in}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const getServerSideProps = withIronSessionSsr(function ({ req }) {
  if (req.session.isLoggedIn) {
    return {
      redirect: {
        destination: "/erp/task",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}, sessionOptions);
