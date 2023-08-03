import Workspace from "@/components/layout/Workspace";
import ExpenseAddModal from "@/page-components/erp/expense/ExpenseAddModal";
import ExpenseEditable from "@/page-components/erp/expense/ExpenseEditable";
import ExpenseList from "@/page-components/erp/expense/ExpenseList";
import { getQueryAsIntOrNull } from "@/utils/query";
import { useMediaQuery } from "@mantine/hooks";
import { IconList, IconNotebook } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

const entryName = "expense";

interface ExpensePageProps {}

function ExpensePage(props: ExpensePageProps) {
  const {} = props;
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)",
  );

  return (
    <div className="flex gap-4">
      <Workspace
        cacheKey={entryName}
        childrenLabels={
          id ? ["Lista wydatków", "Właściwości"] : ["Lista wydatków"]
        }
        childrenIcons={[IconList, IconNotebook]}
        defaultActive={id ? 1 : 0}
        defaultPinned={isMobile ? [] : id ? [0] : []}
      >
        <div className="relative p-4">
          <ExpenseList
            selectedId={id}
            onAddElement={() => setOpenAddModal(true)}
          />
        </div>
        <div className="relative flex flex-col gap-4 p-4">
          <ExpenseEditable id={id} />
        </div>
      </Workspace>
      <ExpenseAddModal
        opened={openAddModal}
        onClose={(id?: number) => {
          setOpenAddModal(false);
          id !== undefined &&
            router.push(`/erp/expense/${id}`).catch((e) => {
              throw e;
            });
        }}
      />
    </div>
  );
}

export default ExpensePage;
