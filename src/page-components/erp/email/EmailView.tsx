import Editable from "@/components/editable/Editable";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableFiles from "@/components/editable/EditableFiles";
import EditableRichText from "@/components/editable/EditableRichText";
import EditableShortText from "@/components/editable/EditableShortText";
import Button from "@/components/ui/Button";
import Wrapper from "@/components/ui/Wrapper";
import { useLoaded } from "@/hooks/useLoaded";
import { api } from "@/utils/api";
import { IconRefresh } from "@tabler/icons-react";

interface ProductEditableProps {
  id: number | null;
  mailboxId: number;
}

function ProductEditable(props: ProductEditableProps) {
  const { id, mailboxId } = props;
  const isLoaded = useLoaded();

  const { data, refetch } = api.product.getById.useQuery(id as number, {
    enabled: id !== null,
  });
  const { mutateAsync: update } = api.product.update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });
  const { mutateAsync: deleteById } = api.product.deleteById.useMutation();

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
        keyName="subject" // hint for Editable
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
          keyName="subject"
          required
          style={{ fontSize: "1.4em" }}
          disabled
        />
      </Wrapper>
      <EditableShortText keyName="from" label="Od" disabled />
      <EditableShortText keyName="to" label="Do" disabled />
      <EditableDateTime keyName="date" label="Data" disabled collapse />

      <EditableRichText label="Wiadomość" keyName="html" disabled />
      <EditableFiles keyName="attachments" label="Pliki" disabled />
    </Editable>
  );
}

export default ProductEditable;
