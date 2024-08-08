import Editable, { type Key } from "@/components/editable/Editable";
import EditableArray from "@/components/editable/EditableArray";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableNumber from "@/components/editable/EditableNumber";
import EditableObject from "@/components/editable/EditableObject";
import EditableShortText from "@/components/editable/EditableShortText";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@shirterp/ui-web/AlertDialog";
import Button from "@shirterp/ui-web/Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shirterp/ui-web/DropdownMenu";
import RefetchButton from "@shirterp/ui-web/RefetchButton";
import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";
import { trpc } from "@/utils/trpc";
import { IconCash, IconDotsVertical, IconTrashX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

interface ExpenseEditableProps {
  id: number | null;
}

function ExpenseEditable(props: ExpenseEditableProps) {
  const { id } = props;
  const isLoaded = useLoaded();
  const t = useTranslation();
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data, refetch } = trpc.expense.getById.useQuery(id as number, {
    enabled: id !== null,
  });
  const { mutateAsync: update } = trpc.expense.update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });
  const { mutateAsync: deleteById } = trpc.expense.deleteById.useMutation();

  const apiUpdate = (key: Key, val: any) => {
    if (!isLoaded) return;
    if (!data) return;

    update({ id: data.id, [key]: val }).catch(console.log);
  };

  const apiDelete = () => {
    if (!data) return;
    deleteById(data.id)
      .then(() => {
        router.push("/erp/expense").catch(console.log);
      })
      .catch(console.log);
  };

  if (!data)
    return (
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
        Brak danych
      </div>
    );

  return (
    <>
      <Editable data={data} onSubmit={apiUpdate}>
        <EditableDebugInfo label="ID: " keyName="id" />
        <div className="flex items-center gap-2">
          <RefetchButton onClick={() => void refetch()} />
          <EditableShortText
            keyName="name"
            leftSection={data.isTemplate ? "Szablon" : undefined}
            required
            style={{ fontSize: "1.4em" }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <IconDotsVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-22 max-w-md">
              <DropdownMenuCheckboxItem
                onClick={() => apiUpdate("isTemplate", !data.isTemplate)}
                checked={data.isTemplate ?? false}
              >
                {t.template}
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteModalOpen(true)}
                className="flex gap-2 focus:bg-destructive focus:text-destructive-foreground"
              >
                {t.delete} {t.customer.singular} <IconTrashX size={18} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <EditableShortText
          keyName="cost"
          label="Cena"
          leftSection={<IconCash />}
        />

        <EditableArray keyName="expenseData" label="Paragon">
          <EditableObject>
            <div className="flex gap-2">
              <EditableShortText keyName="name" className="flex-grow" />
              <EditableNumber
                leftSection={<IconCash />}
                keyName="amount"
                className="w-12"
              />
            </div>
          </EditableObject>
        </EditableArray>

        <EditableDateTime
          keyName="createdAt"
          label="Utworzono"
          disabled
          collapse
        />
        <EditableDateTime
          keyName="updatedAt"
          label="Edytowano"
          disabled
          collapse
        />
      </Editable>
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogDescription>
              {t.operation_not_reversible}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={apiDelete} variant="destructive">
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ExpenseEditable;
