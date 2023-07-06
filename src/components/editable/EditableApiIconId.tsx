import { ReactNode, useId, useState } from "react";

import { XIcon } from "lucide-react";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

import type EditableInput from "@/types/EditableInput";
import { Label } from "../ui/Label";

interface EditableApiIconIdProps extends EditableInput<number> {
  icons?: ReactNode[];
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
  const icon = value!== undefined ? icons[value] : null;

  console.log(value,icons)

  return (
    <div className="flex-grow">
      <Label />

      <Modal open={open} onClose={() => setOpened(false)} title="Wybierz ikonę">
        <div className="grid grid-cols-3 gap-4">
          {icons.map((icon, index) => (
            <Button
              className="h-32 w-32"
              onClick={() => {
                onSubmit && onSubmit(index);
                setOpened(false);
              }}
              key={`${uuid}${index}`}
            >
              {icon}
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
          <Button className=" h-32 w-32" onClick={() => setOpened(true)} disabled={disabled}>
            {icon}
          </Button>
      </div>
    </div>
  );
};

export default EditableApiIconId;
