import NavigationPortal from "@/components/layout/Navigation/NavigationPortal";
import Workspace from "@/components/layout/Workspace";
import ExpenseAddModal from "@/page-components/erp/expense/ExpenseAddModal";
import ExpenseEditable from "@/page-components/erp/expense/ExpenseEditable";
import ExpenseList from "@/page-components/erp/expense/ExpensesList";
import { getQueryAsIntOrNull } from "@/utils/query";
import { createRedirectByRole } from "@/utils/redirectByRole";
import { IconList, IconNotebook } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

const entryName = "expense";

function ExpensePage() {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");

  return (
    <div className="flex gap-4">
      <NavigationPortal>
        <div className="flex grow flex-col p-4">
          <ExpenseList
            selectedId={id}
            onAddElement={() => setOpenAddModal(true)}
          />
        </div>
      </NavigationPortal>
      <Workspace
        childrenMetadata={[{ label: "Właściwości", icon: IconNotebook }]}
      >
        <div className="relative flex flex-col gap-4 p-4">
          <ExpenseEditable id={id} />
        </div>
      </Workspace>
      <ExpenseAddModal
        opened={openAddModal}
        onClose={(id?: number) => {
          setOpenAddModal(false);
          id !== undefined && void router.push(`/erp/${entryName}/${id}`);
        }}
      />
    </div>
  );
}

export const getServerSideProps = createRedirectByRole("employee");

export default ExpensePage;
