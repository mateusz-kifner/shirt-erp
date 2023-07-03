import { useState } from "react";
// import { useTranslation } from "../../../i18n"
import useTranslation from "@/hooks/useTranslation";
import { Trash2Icon } from "lucide-react";
import { Button } from "./ui/Button";
import { Dialog, DialogTitle } from "./ui/Dialog";

interface DeleteButtonProps {
  label: string;
  onDelete: () => void;
  buttonProps?: any;
  modalProps?: any;
}

const DeleteButton = ({
  label,
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
        variant="subtle"
        leftIcon={<Trash2Icon size={18} />}
        onClick={() => setOpenedDelete(true)}
        className="erase_on_print"
        {...buttonProps}
      >
        {t.delete}
      </Button>

      <Dialog
        opened={openedDelete}
        onClose={() => setOpenedDelete(false)}
        title={t.delete}
        centered
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
            <Trash2Icon size={18} />
            {t.delete}
          </Button>
          <Button onClick={() => setOpenedDelete(false)}>{t.cancel}</Button>
        </div>
      </Dialog>
    </>
  );
};

export default DeleteButton;
