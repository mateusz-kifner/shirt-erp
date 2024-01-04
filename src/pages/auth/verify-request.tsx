import { env } from "@/env.mjs";
import useTranslation from "@/hooks/useTranslation";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";

export default function VerifyRequestPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { host } = props;
  const t = useTranslation();
  const router = useRouter();
  const lang = router.locale;

  const check_your_email =
    lang === "pl" ? "Sprawdź swoją pocztę." : "Check your email";
  const sign_in_link =
    lang === "pl"
      ? "Link do logowania został wysłany na twój adres e-mail."
      : "A sign in link has been sent to your email address.";

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="flex w-[30rem] flex-col gap-4 rounded border border-solid border-stone-600 bg-stone-800 p-8">
        <img
          src="https://shirterp.eu/logo.png"
          alt="ShirtERP"
          className="object-scale-down"
        />
        <h3 className="text-center">
          {t.sign_in} {t.to} {env.NEXT_PUBLIC_ORGANIZATION_NAME}
        </h3>
        <h1>{check_your_email}</h1>
        <p>{sign_in_link}</p>
        <p>
          <Link href={"/"}>{host}</Link>
        </p>
      </div>
    </div>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  if (env.NEXT_PUBLIC_DEMO) {
    return {
      redirect: {
        destination:
          "http://localhost:3000/api/auth/callback/email?token=testuser&email=noreply%40shirterp.eu",
      },
    };
  }

  return {
    props: {
      host: context.req.headers.host,
    },
  };
}
