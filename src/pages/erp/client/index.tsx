import { useState } from "react";

import { useMediaQuery } from "@mantine/hooks";
import { IconList, IconNotebook } from "@tabler/icons-react";
import { useRouter } from "next/router";

import ApiEntryEditable from "@/components/ApiEntryEditable";
import Workspace from "@/components/Workspace";
import ClientAddModal from "@/page-components/erp/client/ClientAddModal";
import ClientsList from "@/page-components/erp/client/ClientList";
import template from "@/templates/client.template";
import { getQueryAsIntOrNull } from "@/utils/query";

const entryName = "client";

const ClientsPage = () => {
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
        <ClientsList
          selectedId={id}
          onAddElement={() => setOpenAddModal(true)}
        />
        <ApiEntryEditable
          template={template}
          entryName={entryName}
          id={id}
          allowDelete
        />
      </Workspace>
      <ClientAddModal
        opened={openAddModal}
        onClose={(id?: number) => {
          setOpenAddModal(false);
          id !== undefined &&
            router.push(`/erp/client/${id}`).catch((e) => {
              throw e;
            });
        }}
      />
    </div>
  );
};

export default ClientsPage;
