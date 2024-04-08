import { useState } from "react";

import { IconList, IconNotebook } from "@tabler/icons-react";
import { useRouter } from "next/router";

import Workspace from "@/components/layout/Workspace";
import UserEditable from "@/page-components/erp/user/UserEditable";
import UsersList from "@/page-components/erp/user/UserList";
import { getQueryAsStringOrNull } from "@/utils/query";
import type { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/server/auth";
import UserAddModal from "@/page-components/erp/user/UserAddModal";
import { createRedirectByRole } from "@/utils/redirectByRole";
import NavigationPortal from "@/components/layout/Navigation/NavigationPortal";

const entryName = "user";

const UsersPage = () => {
  const router = useRouter();
  const id = getQueryAsStringOrNull(router, "id");
  const [openAddModal, setOpenAddModal] = useState(false);
  return (
    <div className="flex gap-4">
      <NavigationPortal>
        <div className="p-4 flex flex-col grow">
          <UsersList
            selectedId={id}
            onAddElement={() => setOpenAddModal(true)}
          />
        </div>
      </NavigationPortal>
      <Workspace
        childrenMetadata={
          id !== null ? [{ label: "Właściwości", icon: IconNotebook }] : []
        }
      >
        {id !== null && (
          <div className="relative flex flex-col gap-4 p-4">
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

export const getServerSideProps = createRedirectByRole("manager");

export default UsersPage;
