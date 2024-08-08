import Editable, { type Key } from "@/components/editable/Editable";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableMultiSelect from "@/components/editable/EditableMultiSelect";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shirterp/ui-web/DropdownMenu";
import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";
import { trpc } from "@/utils/trpc";
import { IconDotsVertical, IconRefresh, IconTrashX } from "@tabler/icons-react";
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

  const { data, refetch } = trpc.globalProperty.getById.useQuery(id as number, {
    enabled: id !== null,
  });
  const { mutateAsync: update } = trpc.globalProperty.update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });
  const { mutateAsync: deleteById } =
    trpc.globalProperty.deleteById.useMutation();

  const apiUpdate = (key: Key, val: any) => {
    if (!isLoaded) return;
    if (!data) return;

    update({ id: data.id, [key]: val }).catch(console.log);
  };

  const apiDelete = () => {
    if (!data) return;
    deleteById(data.id)
      .then(() => {
        router.push("/erp/global-properties").catch(console.log);
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
                className="direction-reverse rounded-full"
              >
                <IconDotsVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-22 max-w-md">
              <DropdownMenuItem
                onClick={() => setDeleteModalOpen(true)}
                className="flex gap-2 focus:bg-destructive focus:text-destructive-foreground"
              >
                <IconTrashX size={18} /> {t.delete} {t.globalProperty.singular}
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
