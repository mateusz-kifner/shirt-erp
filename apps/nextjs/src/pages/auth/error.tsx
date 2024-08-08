import Button from "@shirterp/ui-web/Button";
import { env } from "@/env";
import useTranslation from "@/hooks/useTranslation";
import { signIn, signOut, useSession } from "@shirterp/auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

function clearLocalData() {
  const user_theme = localStorage.get("user-theme");
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem("user-theme", user_theme);
}

function AuthErrorPage() {
  const t = useTranslation();
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log(status);
      void signIn();
    } else if (status === "authenticated") {
      void router.push("/");
    }
  }, [status]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="flex max-w-lg flex-col gap-4 rounded border border-stone-600 border-solid bg-stone-800 p-8">
        <img
          src="https://shirterp.eu/logo.png"
          alt="ShirtERP"
          className="object-scale-down"
        />
        <h3 className="text-center">{env.NEXT_PUBLIC_ORGANIZATION_NAME}</h3>
        <p>{t.sign_in_error}</p>
        <Button
          size="xl"
          onClick={() => {
            clearLocalData();
            signOut({ callbackUrl: "/" }).catch(console.log);
            setTimeout(() => {
              void signIn();
            }, 1);
          }}
        >
          {t.sign_in}
        </Button>
        <Button
          size="xl"
          onClick={() => {
            clearLocalData();
            signOut({ callbackUrl: "/" }).catch(console.log);
          }}
        >
          {t.home}
        </Button>
      </div>
    </div>
  );
}

export default AuthErrorPage;
