import { Avatar, useMantineTheme, NavLink } from "@mantine/core"
import { WorkstationType } from "../../../types/WorkstationType"
import { truncString } from "../../../utils/truncString"

interface WorkstationListItemProps {
  onChange?: (item: Partial<WorkstationType>) => void
  value: Partial<WorkstationType>
  active?: boolean
  disabled?: boolean
  linkTo?: (val: Partial<WorkstationType>) => string
}

const WorkstationListItem = ({
  value,
  onChange,
  active,
  disabled,
  linkTo,
}: WorkstationListItemProps) => {
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

export default WorkstationListItem
