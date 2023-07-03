import { useState } from "react";

import { useMediaQuery } from "@mantine/hooks";
import { IconList, IconNotebook } from "@tabler/icons-react";
import { useRouter } from "next/router";

import ApiEntryEditable from "@/components/ApiEntryEditable";
import Workspace from "@/components/Workspace";
import UserAddModal from "@/page-components/erp/user/UserAddModal";
import UsersList from "@/page-components/erp/user/UserList";
import template from "@/templates/user.template.json";
import { getQueryAsIntOrNull } from "@/utils/query";

const entryName = "user";

const UsersPage = () => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)"
  );
  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");

  return (
    <div className="flex gap-4">
      <Workspace
        cacheKey={entryName}
        childrenLabels={
          id ? ["Lista klientów", "Właściwości"] : ["Lista klientów"]
        }
        childrenIcons={[IconList, IconNotebook]}
        defaultActive={id ? 1 : 0}
        defaultPinned={isMobile ? [] : id ? [0] : []}
      >
        <UsersList selectedId={id} onAddElement={() => setOpenAddModal(true)} />
        <ApiEntryEditable
          template={template}
          entryName={entryName}
          id={id}
          allowDelete
        />
      </Workspace>
      <UserAddModal
        opened={openAddModal}
        onClose={(id?: number) => {
          setOpenAddModal(false);
          id !== undefined &&
            router.push(`/erp/user/${id}`).catch((e) => {
              throw e;
            });
        }}
      />
    </div>
  );
};

export default UsersPage;
