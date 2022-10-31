import {
  Button,
  Modal,
  Text,
  Group,
  Sx,
  ButtonProps,
  ModalProps,
} from "@mantine/core"
import React, { useState, CSSProperties } from "react"
import { useTranslation } from "react-i18next"
import { TrashX } from "tabler-icons-react"

interface DeleteButtonProps {
  label: string
  onDelete: () => void
  buttonProps?: ButtonProps
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
        leftIcon={<TrashX size={18} />}
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
        <Text color="red" mb="xl">
          {t("operation-not-reversible")}
        </Text>
        <Group position="apart" mt="xl">
          <Button
            color="red"
            variant="outline"
            leftIcon={<TrashX size={18} />}
            onClick={() => {
              onDelete()
              setOpenedDelete(false)
            }}
          >
            {t("delete", { entry: t(label as any) })}
          </Button>
          <Button onClick={() => setOpenedDelete(false)}>{t("cancel")}</Button>
        </Group>
      </Modal>
    </>
  )
}

export default DeleteButton
