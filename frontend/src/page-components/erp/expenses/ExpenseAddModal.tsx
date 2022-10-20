import { Button, Modal, Stack, Text } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { Plus } from "tabler-icons-react"
import EditableApiEntry from "../../../components/editable/EditableApiEntry"
import EditableText from "../../../components/editable/EditableText"
import useStrapi from "../../../hooks/useStrapi"
import { ExpenseType } from "../../../types/ExpenseType"
import ExpenseListItem from "./ExpenseListItem"

interface ExpenseAddModalProps {
  opened: boolean
  onClose: (id?: number) => void
}

const ExpenseAddModal = ({ opened, onClose }: ExpenseAddModalProps) => {
  const [expenseName, setExpenseName] = useState<any>("Wydatek")
  const [template, setTemplate] = useState<Partial<ExpenseType> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { add, status } = useStrapi<ExpenseType>("expenses")

  useEffect(() => {
    if (!opened) {
      setExpenseName("Wydatek")
      setTemplate(null)
      setError(null)
    }
  }, [opened])

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      title="Utwórz nowy wydatek"
    >
      <Stack>
        <EditableApiEntry
          label="Szablon"
          entryName="expenses"
          Element={ExpenseListItem}
          onSubmit={(template) => {
            setTemplate(template)
            // expenseName === "Klient" && setExpenseName(template.username)
          }}
          value={template}
          withErase
          listProps={{ defaultSearch: "Szablon", filterKeys: ["username"] }}
        />
        <EditableText
          label="Nazwa"
          onSubmit={setExpenseName}
          value={expenseName}
          required
        />

        <Button
          onClick={() => {
            if (expenseName.length == 0)
              return setError("Musisz podać nie pustą nazwę wydatków")
            let new_expense = template ? template : {}
            new_expense?.id && delete new_expense?.id
            new_expense.name = expenseName
            add(new_expense).then((data) => onClose(data?.data?.id))
          }}
          leftIcon={<Plus />}
          loading={status === "loading"}
        >
          Utwórz wydatek
        </Button>
        <Text color="red">{error}</Text>
      </Stack>
    </Modal>
  )
}

export default ExpenseAddModal
