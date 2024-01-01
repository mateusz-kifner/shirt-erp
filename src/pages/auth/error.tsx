import Button from "@/components/ui/Button";
import { env } from "@/env.mjs";
import useTranslation from "@/hooks/useTranslation";
import { signOut } from "next-auth/react";
import { useTransition } from "react";

interface AuthErrorPageProps {}

function AuthErrorPage(props: AuthErrorPageProps) {
  const {} = props;
  const t = useTranslation();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="flex max-w-lg flex-col gap-4 rounded border border-solid border-stone-600 bg-stone-800 p-8">
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
            localStorage.clear();
            sessionStorage.clear();
            signOut({ callbackUrl: "/" });
          }}
        >
          {t.home}
        </Button>
      </div>
    </div>
  );
}

export default AuthErrorPage;
