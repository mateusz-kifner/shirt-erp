import { createRedirectByRole } from "@/utils/redirectByRole";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Main = () => {
  const router = useRouter();

  useEffect(() => {
    void router.push("/erp/task");
  });

  return (
    <div className="flex justify-center pt-10 font-bold">Redirecting...</div>
  );
};

export const getServerSideProps = createRedirectByRole("employee");

export default Main;
