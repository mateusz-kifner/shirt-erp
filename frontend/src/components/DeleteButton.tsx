import { Modal, Text, Group, ModalProps } from "@mantine/core"
import React, { useState, DetailedHTMLProps, ButtonHTMLAttributes } from "react"
// import { useTranslation } from "../../../i18n"
import { TrashX } from "tabler-icons-react"
import { useTranslation } from "../i18n"
import Button from "./basic/Button"

interface DeleteButtonProps {
  label: string
  onDelete: () => void
  buttonProps?: Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    "color"
  >
  modalProps?: ModalProps
}

const DeleteButton = ({
  label,
  onDelete,
  buttonProps,
  modalProps,
}: DeleteButtonProps) => {
  const [openedDelete, setOpenedDelete] = useState<boolean>(false)

  const { t } = useTranslation()

  return (
    <>
      <Button
        color="red"
        variant="outline"
        leftSection={<TrashX size={18} />}
        onClick={() => setOpenedDelete(true)}
        className="erase_on_print"
        {...buttonProps}
      >
        {t("delete", {
          entry: t(label as any),
        })}
      </Button>

      <Modal
        opened={openedDelete}
        onClose={() => setOpenedDelete(false)}
        title={t("delete", { entry: t(label as any) })}
        centered
        {...modalProps}
      >
        <span className="text-red-600 mb-8">
          {t("operation-not-reversible")}
        </span>
        <div className="flex flex-row justify-between mt-8">
          <Button
            color="red"
            variant="outline"
            leftSection={<TrashX size={18} />}
            onClick={() => {
              onDelete()
              setOpenedDelete(false)
            }}
          >
            {t("delete", { entry: t(label as any) })}
          </Button>
          <Button onClick={() => setOpenedDelete(false)}>{t("cancel")}</Button>
        </div>
      </Modal>
    </>
  )
}

export default DeleteButton
