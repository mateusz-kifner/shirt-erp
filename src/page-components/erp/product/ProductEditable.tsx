import Editable from "@/components/editable/Editable";
import EditableArray from "@/components/editable/EditableArray";
import EditableColor from "@/components/editable/EditableColor";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableEnum from "@/components/editable/EditableEnum";
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
}

function ProductEditable(props: ProductEditableProps) {
  const { id } = props;
  const isLoaded = useLoaded();

  const { data, refetch } = api.product.getById.useQuery(id as number, {
    enabled: id !== null,
  });
  const { mutateAsync: update } = api.product.update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });
  // const { mutateAsync: deleteById } = api.product.deleteById.useMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiUpdate = (key: string, val: any) => {
    if (!isLoaded) return;
    if (!data) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    update({ id: data.id, [key]: val }).catch(console.log);
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
              refetch().catch(console.log);
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
      <EditableEnum
        label="Kategoria"
        keyName="category"
        enum_data={[
          "koszulka",
          "bluza",
          "czapka",
          "torba / worek",
          "kamizelka",
          "kubek",
          "inne",
        ]}
      />
      <EditableRichText label="Opis" keyName="description" maxLength={4095} />
      <EditableFiles keyName="previewImages" label="Zdjęcia" maxCount={10} />
      <EditableArray<string> label="Kolory" keyName="colors">
        <EditableColor />
      </EditableArray>
      <EditableArray<string> label="Rozmiary" keyName="sizes">
        <EditableShortText />
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
  );
}

export default ProductEditable;
