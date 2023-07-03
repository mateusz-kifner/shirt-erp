import { Avatar, NavLink } from "@mantine/core"
import { getRandomColorByNumber } from "../utils/getRandomColor"
import { truncString } from "../utils/truncString"

// export type DefaultListItemProps = {
//   onChange?: (item: any) => void
//   value: any
//   active?: boolean
// }

interface DefaultListItemProps {
  onChange?: (item: any) => void
  value: any
  entryKey?: string
  entryKey2?: string
  active?: boolean
  disabled?: boolean
}

export const makeDefaultListItem = (entryKey?: string, entryKey2?: string) => {
  const ListItem = (props: Omit<DefaultListItemProps, "entryKey">) => (
    <DefaultListItem {...props} entryKey={entryKey} entryKey2={entryKey2} />
  )
  return ListItem
}

const DefaultListItem = ({
  value,
  onChange,
  entryKey,
  entryKey2,
  active,
  disabled,
}: DefaultListItemProps) => {
  // start from 1, because 0 is id
  const firstElement = value
    ? entryKey
      ? value[entryKey]
      : value[Object.keys(value)[1]]
    : null
  const secondElement = value
    ? entryKey2
      ? value[entryKey2]
      : value[Object.keys(value)[2]]
    : null
  return (
    <NavLink
      disabled={disabled}
      icon={
        firstElement && (
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
            {" "}
          </Avatar>
        )
      }
      label={firstElement ? truncString(firstElement, 40) : "⸺"}
      description={secondElement && truncString(secondElement, 40)}
      active={active}
      onClick={() => onChange?.(value)}
    />
  )
}

export default DefaultListItem