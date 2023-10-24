import Editable from "@/components/editable/Editable";
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
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import Button from "@/components/ui/Button";
import Wrapper from "@/components/ui/Wrapper";
import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";
import { api } from "@/utils/api";
import { IconRefresh } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface UserEditableProps {
  id: number | string | null;
}

function UserEditable(props: UserEditableProps) {
  const { id } = props;
  const isLoaded = useLoaded();
  const router = useRouter();
  const t = useTranslation();

  const { data: session } = useSession();

  const { data, refetch } = api.user.getById.useQuery(id as string, {
    enabled: id !== null,
  });

  const { mutateAsync: update } = api.user.update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });

  const { mutateAsync: deleteById } = api.user.deleteById.useMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiUpdate = (key: string, val: any) => {
    if (!isLoaded) return;
    if (!data) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    update({ id: data.id, [key]: val }).catch(console.log);
  };

  const apiDelete = () => {
    if (!data) return;
    deleteById(data.id)
      .then(() => {
        void router.push(`/erp/user`);
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
        <Wrapper
          keyName="name" // hint for Editable
          wrapperClassName="flex gap-2 items-center"
          wrapperRightSection={
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
          }
        >
          <EditableShortText label="Nazwa wyświetlana" keyName="name" />
        </Wrapper>
        <EditableShortText label="Email" keyName="email" />
        <EditableDateTime
          label="Email zweryfikowano"
          keyName="emailVerified"
          disabled
        />

        <EditableEnum
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
      <AlertDialog>
        <AlertDialogTrigger asChild className="mt-6">
          <Button variant="destructive">
            {t.delete} {t.user.singular}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            {/* <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle> */}
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
