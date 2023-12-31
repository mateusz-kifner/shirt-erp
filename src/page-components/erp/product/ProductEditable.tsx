import Editable, { Key } from "@/components/editable/Editable";
import EditableArray from "@/components/editable/EditableArray";
import EditableColor from "@/components/editable/EditableColor";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableEnum from "@/components/editable/EditableEnum";
import EditableFiles from "@/components/editable/EditableFiles";
import EditableMultiSelect from "@/components/editable/EditableMultiSelect";
import EditableRichText from "@/components/editable/EditableRichText";
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import RefetchButton from "@/components/ui/RefetchButton";
import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";
import { api } from "@/utils/api";
import { IconDotsVertical, IconTrashX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

interface ProductEditableProps {
  id: number | null;
}

function ProductEditable(props: ProductEditableProps) {
  const { id } = props;
  const isLoaded = useLoaded();
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const t = useTranslation();

  const { data: globalPropertiesData } =
    api["global-properties"].getByCategory.useQuery("size");

  const global_selectables = new Set(
    globalPropertiesData?.map((val) => val?.data ?? []).flat(),
  );

  const { data, refetch } = api.product.getById.useQuery(id as number, {
    enabled: id !== null,
  });
  const { mutateAsync: update } = api.product.update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });
  const { mutateAsync: deleteById } = api.product.deleteById.useMutation();

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
        router.push(`/erp/product`).catch(console.log);
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
        <div className="flex items-center gap-2">
          <RefetchButton onClick={() => void refetch()} />
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
                {t.delete} {t.client.singular} <IconTrashX size={18} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
        <EditableMultiSelect
          label="Rozmiary"
          keyName="sizes"
          enumData={
            Array.from(global_selectables) ?? ["XS", "S", "M", "L", "XL", "XXL"]
          }
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

export default ProductEditable;
