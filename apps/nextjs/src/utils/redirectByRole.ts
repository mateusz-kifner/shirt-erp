import type { roleEnum } from "@/server/api/user/schema";
import { getServerAuthSession } from "@/server/auth";
import type { GetServerSidePropsContext } from "next";

type Roles = (typeof roleEnum.enumValues)[number];

const roles = {
  unauthorized: 1,
  normal: 2,
  employee: 3,
  manager: 10,
  admin: 1000,
};

export const createRedirectByRole = (role: Roles, destination = "/") => {
  const rolePower = roles[role];
  return async (context: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(context);

    if (session === undefined || session?.user === undefined) {
      return { redirect: { destination: "/auth/signin-redirect" } };
    }

    const userRole = roles[session?.user.role ?? "unauthorized"];
    if (userRole < rolePower) {
      return { redirect: { destination, permanent: false } };
    }

    return { props: {} };
  };
};
