import { useEffect, useState } from "react";

import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";

import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableText from "@/components/editable/EditableText";
import Button from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { type ExpenseType } from "@/schema/expenseSchema";
import { api } from "@/utils/api";
import { omit } from "lodash";
import ExpenseListItem from "./ExpenseListItem";

interface ExpenseAddModalProps {
  opened: boolean;
  onClose: (id?: number) => void;
}

const ExpenseAddModal = ({ opened, onClose }: ExpenseAddModalProps) => {
  const router = useRouter();
  const [expenseName, setExpenseName] = useState<string>("Wydatek");
  const [template, setTemplate] = useState<Partial<ExpenseType> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { mutate: createExpense } = api.expense.create.useMutation({
    onSuccess(data) {
      // router.push(`/erp/expense/${data.id}`).catch((e) => {
      //   throw e;
      // });
      onClose(data.id);
    },
    onError(error) {
      setError("Wydatek o takiej nazwie istnieje.");
    },
  });

  useEffect(() => {
    if (!opened) {
      setExpenseName("Wydatek");
      // setTemplate(null);
      setError(null);
    }
  }, [opened]);

  return (
    <Dialog open={opened} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogTitle>Utwórz nowy wydatek</DialogTitle>
        <div className="flex flex-col gap-2">
          <EditableApiEntry
            label="Szablon"
            entryName="expense"
            Element={ExpenseListItem}
            onSubmit={setTemplate}
            value={template}
            allowClear
            listProps={{ defaultSearch: "Szablon", filterKeys: ["name"] }}
          />
          <EditableText
            label="Nazwa wydatku"
            onSubmit={(val) => {
              val && setExpenseName(val);
            }}
            value={expenseName}
            required
          />

          <Button
            onClick={() => {
              if (expenseName.length == 0)
                return setError("Musisz podać nie pustą nazwę wydatku");
              const new_expense = {
                ...(template ? omit(template, "id") : {}),
                name: expenseName,
              };
              createExpense(new_expense);
            }}
            className="mt-4"
          >
            <IconPlus />
            Utwórz wydatek
          </Button>
          <div className="text-red-600">{error}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseAddModal;
