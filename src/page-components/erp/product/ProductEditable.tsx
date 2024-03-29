import Editable, { type Key } from "@/components/editable/Editable";
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
import { trpc } from "@/utils/trpc";
import { IconCash, IconDotsVertical, IconTrashX } from "@tabler/icons-react";
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
    trpc.globalProperty.getByCategory.useQuery("size");

  const global_selectables = new Set(
    globalPropertiesData?.flatMap((val) => val?.data ?? []),
  );

  const { data, refetch } = trpc.product.getById.useQuery(id as number, {
    enabled: id !== null,
  });
  const { mutateAsync: update } = trpc.product.update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });
  const { mutateAsync: deleteById } = trpc.product.deleteById.useMutation();

  const apiUpdate = (key: Key, val: any) => {
    if (!isLoaded) return;
    if (!data) return;

    update({ id: data.id, [key]: val }).catch(console.log);
  };

  const apiDelete = () => {
    if (!data) return;
    deleteById(data.id)
      .then(() => {
        router.push("/erp/product").catch(console.log);
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
              <Button
                size="icon"
                variant="ghost"
                className="direction-reverse rounded-full"
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
                {t.delete} {t.product.singular} <IconTrashX size={18} />
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
        <EditableShortText
          keyName="unitPrice"
          label="Cena jednostkowa"
          leftSection={<IconCash />}
        />
        <EditableRichText label="Opis" keyName="description" maxLength={4095} />
        <EditableFiles keyName="previewImages" label="Zdjęcia" maxCount={10} />
        <EditableArray<string> label="Kolory" keyName="colors">
          <EditableColor />
        </EditableArray>
        <EditableMultiSelect
          label="Rozmiary"
          keyName="sizes"
          freeInput
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
            <AlertDialogAction onClick={apiDelete} variant="destructive">
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ProductEditable;
