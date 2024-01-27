import { useEffect, useState } from "react";

import { IconPlus } from "@tabler/icons-react";

import EditableText from "@/components/editable/EditableText";
import Button from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { api } from "@/utils/api";
import Editable from "@/components/editable/Editable";

interface GlobalPropertiesAddModalProps {
  opened: boolean;
  onClose: (id?: number) => void;
}

const defaultGlobalProperties: {
  globalPropertiesName: string;
  globalPropertiesCategory: string;
} = { globalPropertiesName: "", globalPropertiesCategory: "" };

const GlobalPropertiesAddModal = ({
  opened,
  onClose,
}: GlobalPropertiesAddModalProps) => {
  const [data, setData] = useState(defaultGlobalProperties);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createGlobalProperties } =
    api.globalProperty.create.useMutation();

  useEffect(() => {
    if (!opened) {
      setData(defaultGlobalProperties);
      setError(null);
    }
  }, [opened]);

  return (
    <Dialog open={opened} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogTitle>Utwórz nową właściwość</DialogTitle>
        <Editable
          data={data}
          onSubmit={(key, val) => {
            setData((prev) => ({ ...prev, [key]: val }));
          }}
        >
          <EditableText label="Nazwa" keyName="globalPropertiesName" required />
          <EditableText
            label="Kategoria"
            keyName="globalPropertiesCategory"
            required
          />

          <Button
            onClick={() => {
              if (data.globalPropertiesName.length == 0)
                return setError("Musisz podać nie pustą nazwę właściwości");
              if (data.globalPropertiesCategory.length == 0)
                return setError("Musisz podać nie pustą kategorię właściwości");
              const new_globalProperties = {
                name: data.globalPropertiesName,
                category: data.globalPropertiesCategory,
              };
              createGlobalProperties(new_globalProperties)
                .then((data: { id: number }) => onClose(data.id))
                .catch((e) => {
                  console.log(e);
                  setError("Właściwość o takiej nazwie istnieje.");
                });
            }}
            className="mt-4"
          >
            <IconPlus />
            Utwórz właściwość
          </Button>
          <div className="text-red-600">{error}</div>
        </Editable>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalPropertiesAddModal;
