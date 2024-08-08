import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

function SignInRedirect() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log(status);
      void signIn();
    } else if (status === "authenticated") {
      void router.push("/");
    }
  }, [status]);

  return (
    <div className="flex justify-center pt-10 font-bold">Redirecting...</div>
  );
}
export default SignInRedirect;
