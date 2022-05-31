import {
  Avatar,
  Box,
  Group,
  UnstyledButton,
  useMantineTheme,
  Text,
} from "@mantine/core"
import { FC } from "react"
import { OrderType } from "../../types/OrderType"
import { truncString } from "../../utils/truncString"

const OrderListItem: FC<{
  onChange?: (item: Partial<OrderType>) => void
  value: Partial<OrderType>
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
        {value && (
          <Avatar radius="xl">
            {value?.name && value.name.substring(0, 2)}
          </Avatar>
        )}
        {value ? (
          <Box sx={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {value?.name && truncString(value.name, 20)}
            </Text>
            <Text color="dimmed" size="xs">
              {value?.status && truncString(value.status, 20)}
            </Text>
          </Box>
        ) : (
          <Text size="sm" weight={500} style={{ flexGrow: 1 }}>
            Brak
          </Text>
        )}
      </Group>
    </UnstyledButton>
  )
}

export default OrderListItem
