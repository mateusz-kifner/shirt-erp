import Editable from "@/components/editable/Editable";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableShortText from "@/components/editable/EditableShortText";
import Button from "@/components/ui/Button";
import Wrapper from "@/components/ui/Wrapper";
import { useLoaded } from "@/hooks/useLoaded";
import { api } from "@/utils/api";
import { IconRefresh } from "@tabler/icons-react";

interface UserEditableProps {
  id: number | null;
}

function UserEditable(props: UserEditableProps) {
  const { id } = props;
  const isLoaded = useLoaded();

  const { data, refetch } = api.user.getById.useQuery(id as number, {
    enabled: id !== null,
  });

  if (!data)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        Brak danych
      </div>
    );

  return (
    <Editable data={data} disabled>
      <EditableDebugInfo label="ID: " keyName="id" />
      <Wrapper
        keyName="username" // hint for Editable
        wrapperClassName="flex gap-2 items-center"
        wrapperRightSection={
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => {
              refetch();
            }}
          >
            <IconRefresh />
          </Button>
        }
      >
        <EditableShortText
          keyName="username"
          required
          style={{ fontSize: "1.4em" }}
        />
      </Wrapper>
      <EditableShortText label="Nazwa wyświetlana" keyName="name" disabled />
      <EditableShortText label="Email" keyName="email" disabled />
      <EditableDateTime
        label="Email zweryfikowano"
        keyName="emailVerified"
        disabled
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
  );
}

export default UserEditable;
