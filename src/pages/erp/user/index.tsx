import { useState } from "react";

import { IconList, IconNotebook } from "@tabler/icons-react";
import { useRouter } from "next/router";

import Workspace from "@/components/layout/Workspace";
import UserEditable from "@/page-components/erp/user/UserEditable";
import UsersList from "@/page-components/erp/user/UserList";
import { getQueryAsStringOrNull } from "@/utils/query";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerAuthSession } from "@/server/auth";

const entryName = "user";

const UsersPage = () => {
  const router = useRouter();
  const id = getQueryAsStringOrNull(router, "id");
  return (
    <div className="flex gap-4">
      <Workspace
        cacheKey={entryName}
        navigationMetadata={[{ label: "Lista użytkowników", icon: IconList }]}
        childrenMetadata={
          id !== null ? [{ label: "Właściwości", icon: IconNotebook }] : []
        }
        navigation={
          <div className="relative p-4 ">
            <UsersList selectedId={id} />
          </div>
        }
      >
        {id !== null && (
          <div className="relative flex flex-col gap-4 p-4 ">
            <UserEditable id={id} />
          </div>
        )}
      </Workspace>
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getServerAuthSession(context);
  if (
    session === undefined ||
    !(session?.user.role === "manager" || session?.user.role === "admin")
  ) {
    return { redirect: { destination: "/" } };
  }

  return { props: {} };
};

export default UsersPage;
