import { Avatar, useMantineTheme, NavLink } from "@mantine/core"
import { ProcedureType } from "../../../types/ProcedureType"
import { truncString } from "../../../utils/truncString"

interface ProcedureListItemProps {
  onChange?: (item: Partial<ProcedureType>) => void
  value: Partial<ProcedureType>
  active?: boolean
  disabled?: boolean
  linkTo?: (val: Partial<ProcedureType>) => string
}

const ProcedureListItem = ({
  value,
  onChange,
  active,
  disabled,
  linkTo,
}: ProcedureListItemProps) => {
  const theme = useMantineTheme()

  return (
    <NavLink
      disabled={disabled}
      icon={value && <Avatar radius="xl"></Avatar>}
      label={value ? value?.name && truncString(value.name, 20) : "⸺"}
      onClick={() => onChange?.(value)}
      active={active}
      // @ts-ignore
      component={linkTo ? Link : undefined}
      to={linkTo ? linkTo(value) : ""}
    />
  )
}

export default ProcedureListItem
