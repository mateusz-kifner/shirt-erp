import { useState } from "react";

import { IconList, IconNotebook } from "@tabler/icons-react";
import { useRouter } from "next/router";

import Workspace from "@/components/layout/Workspace";
import UserEditable from "@/page-components/erp/user/UserEditable";
import UsersList from "@/page-components/erp/user/UserList";
import { getQueryAsStringOrNull } from "@/utils/query";
import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/server/auth";
import UserAddModal from "@/page-components/erp/user/UserAddModal";

const entryName = "user";

const UsersPage = () => {
  const router = useRouter();
  const id = getQueryAsStringOrNull(router, "id");
  const [openAddModal, setOpenAddModal] = useState(false);
  return (
    <div className="flex gap-4">
      <Workspace
        cacheKey={entryName}
        navigationMetadata={[{ label: "", icon: IconList }]}
        childrenMetadata={
          id !== null ? [{ label: "Właściwości", icon: IconNotebook }] : []
        }
        navigation={
          <div className="relative p-4 ">
            <UsersList
              selectedId={id}
              onAddElement={() => setOpenAddModal(true)}
            />
          </div>
        }
      >
        {id !== null && (
          <div className="relative flex flex-col gap-4 p-4 ">
            <UserEditable id={id} />
          </div>
        )}
      </Workspace>
      <UserAddModal
        opened={openAddModal}
        onClose={(id?: string) => {
          setOpenAddModal(false);
          id !== undefined && void router.push(`/erp/user/${id}`);
        }}
      />
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
