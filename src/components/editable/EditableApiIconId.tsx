import { ReactNode, useId, useState } from "react";

import Button from "@/components/ui/Button";

import { Label } from "@/components/ui/Label";
import type EditableInput from "@/schema/EditableInput";

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
  const icon = value !== undefined ? icons[value] : null;

  return (
    <div className="flex-grow">
      <Label>{label}</Label>

      {/* <Modal open={open} onClose={() => setOpened(false)} title="Wybierz ikonę">
        <div className="grid grid-cols-3 gap-4">
          {icons.map((icon, index) => (
            <Button
              variant="outline"
              className="h-32 w-32"
              onClick={() => {
                onSubmit && onSubmit(index);
                setOpened(false);
              }}
              key={`${uuid}${index}`}
            >
              <div className="flex h-full w-full items-center justify-center dark:invert">
                {!!icon && icon}
              </div>
            </Button>
          ))}
          <Button
            className="h-32 w-32"
            variant="outline"
            onClick={() => {
              onSubmit && onSubmit(null);
              setOpened(false);
            }}
            key={uuid + "null"}
          >
            <IconX size={96} />
          </Button>
        </div>
      </Modal>
      */}
      <div className="flex flex-col gap-2">
        <Button
          className=" h-32 w-32"
          variant="outline"
          onClick={() => setOpened(true)}
          disabled={disabled}
        >
          <div className="flex h-full w-full items-center justify-center dark:invert">
            {!!icon && icon}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default EditableApiIconId;
