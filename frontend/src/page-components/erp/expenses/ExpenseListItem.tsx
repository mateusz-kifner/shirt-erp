import { Avatar, NavLink } from "@mantine/core"
import { ExpenseType } from "../../../types/ExpenseType"
import { truncString } from "../../../utils/truncString"

interface ExpenseListItemProps {
  onChange?: (item: Partial<ExpenseType>) => void
  value: Partial<ExpenseType>
  active?: boolean
}

const ExpenseListItem = ({ value, onChange, active }: ExpenseListItemProps) => {
  return (
    <NavLink
      onClick={() => onChange?.(value)}
      icon={
        value && (
          <Avatar radius="xl">
            {value.name?.substring(0, 2).toUpperCase()}
          </Avatar>
        )
      }
      label={value ? value.name && truncString(value.name, 40) : "⸺"}
      description={(value.price ?? "") + "zł"}
      active={active}
    />
  )
}

export default ExpenseListItem
