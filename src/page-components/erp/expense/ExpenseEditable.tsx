import Editable from "@/components/editable/Editable";
import EditableArray from "@/components/editable/EditableArray";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableGroup from "@/components/editable/EditableGroup";
import EditableShortText from "@/components/editable/EditableShortText";
import Button from "@/components/ui/Button";
import Wrapper from "@/components/ui/Wrapper";
import { useLoaded } from "@/hooks/useLoaded";
import { api } from "@/utils/api";
import { IconCash, IconRefresh } from "@tabler/icons-react";

interface ExpenseEditableProps {
  id: number | null;
}

function ExpenseEditable(props: ExpenseEditableProps) {
  const { id } = props;
  const isLoaded = useLoaded();

  const { data, refetch } = api.expense.getById.useQuery(id as number, {
    enabled: id !== null,
  });
  const { mutateAsync: update } = api.expense.update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });
  const { mutateAsync: deleteById } = api.expense.deleteById.useMutation();

  const apiUpdate = (key: string, val: any) => {
    if (!isLoaded) return;
    if (!data) return;
    update({ id: data.id, [key]: val });
  };

  if (!data)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        Brak danych
      </div>
    );

  return (
    <Editable data={data} onSubmit={apiUpdate}>
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
              refetch();
            }}
          >
            <IconRefresh />
          </Button>
        }
      >
        <EditableShortText
          keyName="name"
          required
          style={{ fontSize: "1.4em" }}
        />
      </Wrapper>
      <EditableShortText
        keyName="price"
        label="Cena"
        leftSection={<IconCash />}
      />

      <EditableGroup>
        <EditableArray keyName="expensesCost" label="Koszt">
          <EditableShortText leftSection={<IconCash />} />
        </EditableArray>
        <EditableArray keyName="expensesNames" label="Nazwa">
          <EditableShortText />
        </EditableArray>
      </EditableGroup>

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

export default ExpenseEditable;
