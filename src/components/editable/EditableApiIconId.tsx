import { useEffect, useId, useState } from "react";

import { IconX } from "@tabler/icons-react";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

import type EditableInput from "@/types/EditableInput";

interface EditableApiIconIdProps extends EditableInput<number> {
  entryName?: string;
}

const EditableApiIconId = ({
  label,
  value,
  initialValue,
  onSubmit,
  disabled,
  required,
  entryName,
}: EditableApiIconIdProps) => {
  const [open, setOpened] = useState(false);
  const [iconId, setIconId] = useState<number | null>(
    value ?? initialValue ?? null
  );
  // const { iconsData } = useIconsContext()
  const uuid = useId();

  useEffect(() => {
    value && setIconId(value);
  }, [value]);

  if (!entryName) return null;

  return (
    <div className="flex-grow">
      {label && (
        <label
          htmlFor={"textarea_" + uuid}
          className="
          text-sm
          dark:text-stone-300"
        >
          <div className="flex items-center py-1">{label}</div>
        </label>
      )}

      <Modal open={open} onClose={() => setOpened(false)} title="Wybierz ikonę">
        <div className="grid grid-cols-3 gap-4">
          {/* {iconsData &&
            iconsData[entryName as keyof typeof iconsData].map(
              (val: { id: number }) => (
                <Button
                className="w-32 h-32"

                  onClick={() => {
                    onSubmit && onSubmit(val.id)
                    setIconId(val.id)
                    setOpened(false)
                  }}
                  key={uuid + val.id}
                >
                  <ApiIconSVG entryName={entryName} id={val.id} size={96} /> 
                </Button>
              )
            )} */}
          <Button
            className="h-32 w-32"
            onClick={() => {
              onSubmit && onSubmit(null);
              setIconId(null);
              setOpened(false);
            }}
            key={uuid + "null"}
          >
            <IconX size={96} />
          </Button>
        </div>
      </Modal>
      <div className="flex flex-col gap-2">
        <div className="flex  gap-2">
          <Button onClick={() => setOpened(true)} disabled={disabled}>
            {/* <ApiIconSVG entryName={entryName} size={48} id={iconId} /> */}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditableApiIconId;
