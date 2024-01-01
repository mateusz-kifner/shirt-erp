import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { env } from "@/env.mjs";
import useTranslation from "@/hooks/useTranslation";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import type React from "react";
import { useState } from "react";

/**
 * The following errors are passed as error query parameters to the default or overridden sign-in page.
 *
 * [Documentation](https://next-auth.js.org/configuration/pages#sign-in-page) */

// app will crash in DEMO mode if two people wants to signin at the same time

export type SignInErrorTypes =
  | "Signin"
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired"
  | "default";

export default function SigninPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { csrfToken, providers, callbackUrl, email, error: errorType } = props;
  const [purged, setPurged] = useState(false);
  const t = useTranslation();
  const isDemo = env.NEXT_PUBLIC_DEMO;

  const { mutateAsync } = api.admin.purgeAuthTokens.useMutation();

  // We only want to render providers
  const providersToRender = Object.values(providers).filter((provider) => {
    if (provider.type === "oauth" || provider.type === "email") {
      // Always render oauth and email type providers
      return true;
    }
    // Don't render other provider types
    return false;
  });

  const errors: Record<SignInErrorTypes, string> = {
    Signin: "Try signing in with a different account.",
    OAuthSignin: "Try signing in with a different account.",
    OAuthCallback: "Try signing in with a different account.",
    OAuthCreateAccount: "Try signing in with a different account.",
    EmailCreateAccount: "Try signing in with a different account.",
    Callback: "Try signing in with a different account.",
    OAuthAccountNotLinked:
      "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "The e-mail could not be sent.",
    CredentialsSignin:
      "Sign in failed. Check the details you provided are correct.",
    SessionRequired: "Please sign in to access this page.",
    default: "Unable to sign in.",
  };

  const error = errorType && (errors[errorType] ?? errors.default);

  const logos = "https://authjs.dev/img/providers";

  // app will crash if two people wants to signin at the same time
  if (isDemo && !purged && errorType === "EmailSignin") {
    void mutateAsync();
    setPurged(true);
  }

  if (isDemo) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <div className="flex max-w-lg flex-col gap-4 rounded border border-solid border-stone-600 bg-stone-800 p-8">
          <img
            src="https://shirterp.eu/logo.png"
            alt="ShirtERP"
            className="object-scale-down"
          />
          <h3 className="text-center">
            {t.sign_in} {t.to} {env.NEXT_PUBLIC_ORGANIZATION_NAME}
          </h3>
          <Button
            type="submit"
            className="flex-grow py-8 text-lg"
            size="lg"
            onClick={() =>
              void signIn("email", {
                email: "noreply@shirterp.eu",
              })
            }
          >
            <span className="flex-grow">{t.sign_in}</span>
          </Button>
        </div>
      </div>
    );
  }

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
        {error && (
          <div className="italic text-red-500">
            <p>{error}</p>
          </div>
        )}
        {providersToRender.map((provider, i: number) => (
          <div key={provider.id} className="">
            {provider.type === "oauth" && (
              <form action={provider.signinUrl} method="POST" className="flex">
                <input
                  type="hidden"
                  name="csrfToken"
                  value={csrfToken ?? undefined}
                />
                {callbackUrl && (
                  <input type="hidden" name="callbackUrl" value={callbackUrl} />
                )}
                <Button
                  type="submit"
                  className="flex-grow py-8 text-lg"
                  size="lg"
                >
                  <img
                    loading="lazy"
                    height="24"
                    width="24"
                    src={`${logos}/${provider.id}-dark.svg`}
                  />
                  <span className="flex-grow">
                    {t.sign_in} {t.with} {provider.name}
                  </span>
                </Button>
              </form>
            )}
            {(provider.type === "email" || provider.type === "credentials") &&
              i > 0 &&
              providersToRender[i - 1]?.type !== "email" &&
              providersToRender[i - 1]?.type !== "credentials" && (
                <hr className="border-b-none border-l-none border-r-none border-t-solid mx-auto mb-8 mt-4 block overflow-visible border-t border-t-stone-500" />
              )}
            {provider.type === "email" && (
              <form
                action={provider.signinUrl}
                method="POST"
                className="flex flex-col gap-4"
              >
                <input
                  type="hidden"
                  name="csrfToken"
                  value={csrfToken ?? undefined}
                />
                <Input
                  id={`input-email-for-${provider.id}-provider`}
                  autoFocus
                  type="email"
                  name="email"
                  value={(Array.isArray(email) ? email[0] : email) ?? undefined}
                  placeholder="Email"
                  required
                />
                <Button
                  id="submitButton"
                  type="submit"
                  className="flex-grow py-8 text-lg"
                  size="lg"
                >
                  {t.sign_in} {t.with} {provider.name}
                </Button>
              </form>
            )}
            {provider.type === "credentials" && (
              <form action={provider.callbackUrl} method="POST">
                <input
                  type="hidden"
                  name="csrfToken"
                  value={csrfToken ?? undefined}
                />
                <button type="submit">
                  {t.sign_in} {t.with} {provider.name}
                </button>
              </form>
            )}
            {(provider.type === "email" || provider.type === "credentials") &&
              i + 1 < providersToRender.length && <hr />}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  const csrfToken = await getCsrfToken(context);
  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();
  console.log(providers);
  // console.log(context);
  return {
    props: {
      providers: providers ?? [],
      csrfToken: csrfToken ?? null,
      error: (context.query?.error ?? null) as SignInErrorTypes | null,
      callbackUrl: context.query?.callbackUrl ?? null,
      email: context.query?.email ?? null,
    },
  };
}
