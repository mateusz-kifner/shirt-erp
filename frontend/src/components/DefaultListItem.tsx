import {
  Avatar,
  Box,
  Group,
  UnstyledButton,
  Text,
  useMantineTheme,
} from "@mantine/core"
import { FC } from "react"
import { truncString } from "../utils/truncString"

interface DefaultListItemProps {
  onChange?: (item: any) => void
  value: any
  entryKey?: string
}

export const makeDefaultListItem = (entryKey: string) => {
  return ({ value, onChange }: DefaultListItemProps) => (
    <DefaultListItem value={value} onChange={onChange} entryKey={entryKey} />
  )
}

const DefaultListItem: FC<DefaultListItemProps> = ({
  value,
  onChange,
  entryKey,
}) => {
  const theme = useMantineTheme()
  const firstElement = entryKey ? value[entryKey] : value[Object.keys(value)[0]]
  return (
    <UnstyledButton
      sx={{
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      }}
      onClick={() => onChange && onChange(value)}
    >
      <Group>
        <Avatar radius="xl"></Avatar>
        <Box sx={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {firstElement && truncString(firstElement, 40)}
          </Text>
        </Box>
      </Group>
    </UnstyledButton>
  )
}

export default DefaultListItem
