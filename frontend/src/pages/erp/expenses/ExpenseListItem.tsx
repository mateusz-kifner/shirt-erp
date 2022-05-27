import {
  Avatar,
  Box,
  Group,
  UnstyledButton,
  useMantineTheme,
  Text,
} from "@mantine/core"
import { FC } from "react"
import { ExpenseType } from "../../../types/ExpenseType"
import { truncString } from "../../../utils/truncString"

const ExpenseListItem: FC<{
  onChange?: (expense: Partial<ExpenseType>) => void
  value: Partial<ExpenseType>
}> = ({ value, onChange }) => {
  const theme = useMantineTheme()

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
        <Avatar radius="xl">{value.name?.substring(0, 2).toUpperCase()}</Avatar>
        <Box sx={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {value.name && truncString(value.name, 40)}
          </Text>
          <Text color="dimmed" size="xs">
            {value.price && value.price} zł
          </Text>
        </Box>
      </Group>
    </UnstyledButton>
  )
}

export default ExpenseListItem
