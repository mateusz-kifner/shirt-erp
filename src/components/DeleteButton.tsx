import { useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import { IconTrashX } from "@tabler/icons-react";
import Button, { type ButtonProps } from "./ui/Button";
import { Dialog, DialogTitle } from "./ui/Dialog";
import type { DialogProps } from "@radix-ui/react-dialog";

interface DeleteButtonProps {
  onDelete: () => void;
  buttonProps?: ButtonProps;
  modalProps?: DialogProps;
}

const DeleteButton = ({
  onDelete,
  buttonProps,
  modalProps,
}: DeleteButtonProps) => {
  const [openedDelete, setOpenedDelete] = useState<boolean>(false);

  const t = useTranslation();

  return (
    <>
      <Button
        color="red"
        variant="outline"
        leftSection={<IconTrashX size={18} />}
        onClick={() => setOpenedDelete(true)}
        className="erase_on_print"
        {...buttonProps}
      >
        {t.delete}
      </Button>

      <Dialog
        open={openedDelete}
        onOpenChange={setOpenedDelete}
        {...modalProps}
      >
        <DialogTitle>{t.operation_not_reversible}</DialogTitle>
        <div className="mt-8 flex flex-col justify-between gap-2">
          <Button
            onClick={() => {
              onDelete();
              setOpenedDelete(false);
            }}
          >
            <IconTrashX size={18} />
            {t.delete}
          </Button>
          <Button onClick={() => setOpenedDelete(false)}>{t.cancel}</Button>
        </div>
      </Dialog>
    </>
  );
};

export default DeleteButton;
