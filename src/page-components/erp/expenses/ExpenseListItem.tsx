import { Avatar, NavLink } from "@mantine/core"
import { ExpenseType } from "../../../types/ExpenseType"
import { getRandomColorByNumber } from "../../../utils/getRandomColor"
import { truncString } from "../../../utils/truncString"

interface ExpenseListItemProps {
  onChange?: (item: Partial<ExpenseType>) => void
  value: Partial<ExpenseType>
  active?: boolean
  disabled?: boolean
}

const ExpenseListItem = ({
  value,
  onChange,
  active,
  disabled,
}: ExpenseListItemProps) => {
  return (
    <NavLink
      disabled={disabled}
      onClick={() => onChange?.(value)}
      icon={
        value && (
          <Avatar
            radius="xl"
            styles={{
              placeholder: {
                background: `radial-gradient(circle, transparent 64%, ${getRandomColorByNumber(
                  value.id
                )}  66%)`,
              },
            }}
          >
            {value.name?.substring(0, 2).toUpperCase()}
          </Avatar>
        )
      }
      label={value ? value.name && truncString(value.name, 40) : "⸺"}
      description={(value?.price ?? "") + "zł"}
      active={active}
    />
  )
}

export default ExpenseListItem