import { Avatar, useMantineTheme, NavLink } from "@mantine/core"
import ApiIconSVG from "../../../components/api/ApiIconSVG"
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
  console.log(value)
  return (
    <NavLink
      disabled={disabled}
      icon={
        value && (
          <Avatar radius="xl">
            {value?.iconId ? (
              <ApiIconSVG
                entryName="workstations"
                id={value?.iconId}
                // color={
                //   value?.color?.hex
                //     ? convert.hex.hsl(value.color.hex)[2] < 0.5
                //       ? "#fff"
                //       : "#000"
                //     : theme.colorScheme === "dark"
                //     ? "#fff"
                //     : "#000"
                // }
                noError
              />
            ) : (
              " "
            )}
          </Avatar>
        )
      }
      label={value ? value?.name && truncString(value.name, 20) : "⸺"}
      description={
        value
          ? value?.description && truncString(value.description, 20)
          : undefined
      }
      onClick={() => onChange?.(value)}
      active={active}
      // @ts-ignore
      component={linkTo ? Link : undefined}
      to={linkTo ? linkTo(value) : ""}
    />
  )
}

export default WorkstationListItem
