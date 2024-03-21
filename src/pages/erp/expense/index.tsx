import Workspace from "@/components/layout/Workspace";
import ExpenseAddModal from "@/page-components/erp/expense/ExpenseAddModal";
import ExpenseEditable from "@/page-components/erp/expense/ExpenseEditable";
import ExpenseList from "@/page-components/erp/expense/ExpenseList";
import { getQueryAsIntOrNull } from "@/utils/query";
import { IconList, IconNotebook } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

const entryName = "expense";

type ExpensePageProps = {};

function ExpensePage(props: ExpensePageProps) {
  const {} = props;
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");

  return (
    <div className="flex gap-4">
      <Workspace
        cacheKey={entryName}
        navigationMetadata={[{ label: "", icon: IconList }]}
        childrenMetadata={[{ label: "Właściwości", icon: IconNotebook }]}
        navigation={
          <div className="relative p-4">
            <ExpenseList
              selectedId={id}
              onAddElement={() => setOpenAddModal(true)}
            />
          </div>
        }
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

export default ExpensePage;
