import Editable, { Key } from "@/components/editable/Editable";
import EditableArray from "@/components/editable/EditableArray";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableMultiSelect from "@/components/editable/EditableMultiSelect";
import EditableNumber from "@/components/editable/EditableNumber";
import EditableObject from "@/components/editable/EditableObject";
import EditableShortText from "@/components/editable/EditableShortText";
import EditableSwitch from "@/components/editable/EditableSwitch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import Button from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import Wrapper from "@/components/ui/Wrapper";
import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";
import { api } from "@/utils/api";
import {
  IconCash,
  IconDotsVertical,
  IconRefresh,
  IconTrashX,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

interface GlobalPropertiesEditableProps {
  id: number | null;
}

function GlobalPropertiesEditable(props: GlobalPropertiesEditableProps) {
  const { id } = props;
  const isLoaded = useLoaded();
  const t = useTranslation();
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data, refetch } = api["global-properties"].getById.useQuery(
    id as number,
    {
      enabled: id !== null,
    },
  );
  const { mutateAsync: update } = api["global-properties"].update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });
  const { mutateAsync: deleteById } =
    api["global-properties"].deleteById.useMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiUpdate = (key: Key, val: any) => {
    if (!isLoaded) return;
    if (!data) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    update({ id: data.id, [key]: val }).catch(console.log);
  };

  const apiDelete = () => {
    if (!data) return;
    deleteById(data.id)
      .then(() => {
        router.push(`/erp/global-properties`).catch(console.log);
      })
      .catch(console.log);
  };

  if (!data)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        Brak danych
      </div>
    );

  return (
    <>
      <Editable data={data} onSubmit={apiUpdate}>
        <EditableDebugInfo label="ID: " keyName="id" />
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => {
              refetch().catch(console.log);
            }}
          >
            <IconRefresh />
          </Button>

          <EditableShortText
            keyName="name"
            required
            style={{ fontSize: "1.4em" }}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full direction-reverse"
              >
                <IconDotsVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-22 max-w-md">
              <DropdownMenuItem
                onClick={() => setDeleteModalOpen(true)}
                className="flex gap-2 focus:bg-destructive focus:text-destructive-foreground"
              >
                <IconTrashX size={18} /> {t.delete}{" "}
                {t["global-properties"].singular}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <EditableShortText keyName="category" required label="Kategoria" />
        <EditableMultiSelect keyName="data" label="Dane" freeInput />
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

export default GlobalPropertiesEditable;
