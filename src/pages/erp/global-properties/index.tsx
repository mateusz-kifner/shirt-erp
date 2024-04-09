import NavigationPortal from "@/components/layout/Navigation/NavigationPortal";
import Workspace from "@/components/layout/Workspace";
import GlobalPropertiesAddModal from "@/page-components/erp/global-properties/GlobalPropertiesAddModal";
import GlobalPropertiesEditable from "@/page-components/erp/global-properties/GlobalPropertiesEditable";
import GlobalPropertiesList from "@/page-components/erp/global-properties/GlobalPropertiesList";
import { getQueryAsIntOrNull } from "@/utils/query";
import { createRedirectByRole } from "@/utils/redirectByRole";
import { IconList, IconNotebook } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

const entryName = "global-properties";

function GlobalPropertiesPage() {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");

  return (
    <div className="flex gap-4">
      <NavigationPortal>
        <div className="flex grow flex-col p-4">
          <GlobalPropertiesList
            selectedId={id}
            onAddElement={() => setOpenAddModal(true)}
          />
        </div>
      </NavigationPortal>
      <Workspace
        childrenMetadata={[{ label: "Właściwości", icon: IconNotebook }]}
      >
        <div className="relative flex flex-col gap-4 p-4">
          <GlobalPropertiesEditable id={id} />
        </div>
      </Workspace>
      <GlobalPropertiesAddModal
        opened={openAddModal}
        onClose={(id?: number) => {
          setOpenAddModal(false);
          id !== undefined && void router.push(`/erp/${entryName}/${id}`);
        }}
      />
    </div>
  );
}

export const getServerSideProps = createRedirectByRole("manager");

export default GlobalPropertiesPage;
