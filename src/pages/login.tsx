import { useState, type FormEvent } from "react";

import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";

import Modal from "@/components/ui/Modal";
import useTranslation from "@/hooks/useTranslation";
import { sessionOptions } from "@/lib/session";
import { api } from "@/utils/api";

export default function Login() {
  const router = useRouter();
  const t = useTranslation();

  const login = api.session.login.useMutation({
    onSuccess() {
      void router.push("/task");
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

  return (
    <div>
      <Modal
        open={true}
        disableClose
        title={<h2 className="text-2xl">{t.sign_in}</h2>}
      >
        <div>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-4 px-2 pb-8 pt-2">
              <div className="h-7  text-red-700 dark:text-red-400">
                {!!errorMsg ? errorMsg : ` `}
              </div>
              <input
                name="username"
                className="
                data-disabled:text-gray-500
                dark:data-disabled:text-gray-500
                data-disabled:bg-transparent 
                dark:data-disabled:bg-transparent
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
                dark:border-stone-600
                dark:bg-stone-800 
                dark:outline-none 
                dark:read-only:bg-transparent 
                dark:read-only:outline-none
                dark:focus:border-sky-600"
                type="text"
                placeholder={t.username}
              />
              <input
                name="password"
                className="
                data-disabled:text-gray-500
                dark:data-disabled:text-gray-500
                data-disabled:bg-transparent 
                dark:data-disabled:bg-transparent
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
                dark:border-stone-600
                dark:bg-stone-800 
                dark:outline-none 
                dark:read-only:bg-transparent 
                dark:read-only:outline-none
                dark:focus:border-sky-600"
                type="password"
                placeholder={t.password}
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
        </div>
      </Modal>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(function ({ req }) {
  if (req.session.isLoggedIn) {
    return {
      redirect: {
        destination: "/task",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}, sessionOptions);
