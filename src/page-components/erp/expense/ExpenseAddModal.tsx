import { useEffect, useState } from "react";

import { IconPlus } from "@tabler/icons-react";

import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableText from "@/components/editable/EditableText";
import Button from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { type Expense } from "@/schema/expenseZodSchema";
import { api } from "@/utils/api";
import _ from "lodash";
import ExpenseListItem from "./ExpenseListItem";
import Editable from "@/components/editable/Editable";

interface ExpenseAddModalProps {
  opened: boolean;
  onClose: (id?: number) => void;
}

const defaultExpense: {
  expenseName: string;
  template: Partial<Expense> | null;
} = { expenseName: "Wydatek", template: null };

const ExpenseAddModal = ({ opened, onClose }: ExpenseAddModalProps) => {
  const [data, setData] = useState(defaultExpense);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createExpense } = api.expense.create.useMutation();

  useEffect(() => {
    if (!opened) {
      setData(defaultExpense);
      setError(null);
    }
  }, [opened]);

  return (
    <Dialog open={opened} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogTitle>Utwórz nowy wydatek</DialogTitle>
        <Editable
          data={data}
          onSubmit={(key, val) => {
            setData((prev) => ({ ...prev, [key]: val }));
          }}
        >
          <EditableApiEntry
            label="Szablon"
            entryName="expense"
            Element={ExpenseListItem}
            keyName="template"
            allowClear
            listProps={{ defaultSearch: "Szablon", filterKeys: ["name"] }}
          />
          <EditableText label="Nazwa wydatku" keyName="expenseName" required />

          <Button
            onClick={() => {
              if (data.expenseName.length == 0)
                return setError("Musisz podać nie pustą nazwę wydatku");
              const new_expense = {
                ...(data.template ? _.omit(data.template, "id") : {}),
                name: data.expenseName,
              };
              createExpense(new_expense)
                .then((data: { id: number }) => onClose(data.id))
                .catch((e) => {
                  console.log(e);
                  setError("Wydatek o takiej nazwie istnieje.");
                });
            }}
            className="mt-4"
          >
            <IconPlus />
            Utwórz wydatek
          </Button>
          <div className="text-red-600">{error}</div>
        </Editable>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseAddModal;
