import { useId, useState } from "react";

import { XIcon, type LucideIcon } from "lucide-react";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

import type EditableInput from "@/types/EditableInput";
import { Label } from "../ui/Label";

interface EditableApiIconIdProps extends EditableInput<number> {
  entryName?: string;
  icons?: LucideIcon[];
}

const EditableApiIconId = ({
  label,
  value,
  onSubmit,
  disabled,
  required,
  icons = [],
}: EditableApiIconIdProps) => {
  const [open, setOpened] = useState(false);
  const uuid = useId();
  const Icon = !!value ? icons[value] : null;

  return (
    <div className="flex-grow">
      <Label />

      <Modal open={open} onClose={() => setOpened(false)} title="Wybierz ikonę">
        <div className="grid grid-cols-3 gap-4">
          {icons.map((Icon, index) => (
            <Button
              className="h-32 w-32"
              onClick={() => {
                onSubmit && onSubmit(index);
                setOpened(false);
              }}
              key={`${uuid}${index}`}
            >
              <Icon size={96} />
            </Button>
          ))}
          <Button
            className="h-32 w-32"
            onClick={() => {
              onSubmit && onSubmit(null);
              setOpened(false);
            }}
            key={uuid + "null"}
          >
            <XIcon size={96} />
          </Button>
        </div>
      </Modal>
      <div className="flex flex-col gap-2">
        <div className="flex  gap-2">
          <Button onClick={() => setOpened(true)} disabled={disabled}>
            {!!Icon && <Icon size={48} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditableApiIconId;
