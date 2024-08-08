import Editable, { type Key } from "@/components/editable/Editable";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableEnum from "@/components/editable/EditableEnum";
import EditableShortText from "@/components/editable/EditableShortText";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/AlertDialog";
import Button from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import RefetchButton from "@/components/ui/RefetchButton";
import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";
import { trpc } from "@/utils/trpc";
import { IconDotsVertical, IconTrashX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

interface UserEditableProps {
  id: number | string | null;
}

function UserEditable(props: UserEditableProps) {
  const { id } = props;
  const isLoaded = useLoaded();
  const router = useRouter();
  const t = useTranslation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: session } = useSession();

  const { data, refetch } = trpc.user.getById.useQuery(id as string, {
    enabled: id !== null,
  });

  const { mutateAsync: update } = trpc.user.update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });

  const { mutateAsync: deleteById } = trpc.user.deleteById.useMutation();

  const apiUpdate = (key: Key, val: any) => {
    if (!isLoaded) return;
    if (!data) return;

    update({ id: data.id, [key]: val }).catch(console.log);
  };

  const apiDelete = () => {
    if (!data) return;
    deleteById(data.id)
      .then(() => {
        void router.push("/erp/user");
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
      <Editable
        data={data}
        onSubmit={apiUpdate}
        disabled={
          session !== null &&
          data.role === "admin" &&
          session.user.role === "manager"
        }
      >
        <EditableDebugInfo label="ID: " keyName="id" />
        <div className="flex items-center gap-2">
          <RefetchButton onClick={() => void refetch()} />
          <EditableShortText
            keyName="name"
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
              <DropdownMenuItem
                onClick={() => setDeleteModalOpen(true)}
                className="flex gap-2 focus:bg-destructive focus:text-destructive-foreground"
              >
                {t.delete} {t.customer.singular} <IconTrashX size={18} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <EditableShortText label="Email" keyName="email" />
        <EditableDateTime
          label="Email zweryfikowano"
          keyName="emailVerified"
          disabled
        />

        <EditableEnum
          label="Rola"
          keyName="role"
          enum_data={["normal", "employee", "manager", "admin"]}
        />

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
            <AlertDialogAction onClick={apiDelete}>
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default UserEditable;
