import { Avatar, Box, Group, UnstyledButton, Text } from "@mantine/core"
import { FC } from "react"
import { truncString } from "../utils/truncString"

interface DefaultListItemProps {
  onChange?: (item: any) => void
  value: any
  entryKey?: string
  highlight?: boolean
}

export const makeDefaultListItem = (entryKey: string) => {
  const ListItem = (props: Omit<DefaultListItemProps, "entryKey">) => (
    <DefaultListItem {...props} entryKey={entryKey} />
  )
  return ListItem
}

const DefaultListItem: FC<DefaultListItemProps> = ({
  value,
  onChange,
  entryKey,
  highlight,
}) => {
  const firstElement = value
    ? entryKey
      ? value[entryKey]
      : value[Object.keys(value)[0]]
    : null
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        backgroundColor: highlight
          ? theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0]
          : undefined,
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
      onClick={() => onChange && onChange(value)}
    >
      <Group>
        {value ? (
          <>
            <Avatar radius="xl"></Avatar>
            <Box sx={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {firstElement && truncString(firstElement, 40)}
              </Text>
            </Box>
          </>
        ) : (
          <Text size="sm" weight={500}>
            Brak
          </Text>
        )}
      </Group>
    </UnstyledButton>
  )
}

export default DefaultListItem
