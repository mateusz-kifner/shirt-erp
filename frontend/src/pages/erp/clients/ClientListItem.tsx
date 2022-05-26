import {
  Avatar,
  Box,
  Group,
  UnstyledButton,
  useMantineTheme,
  Text,
} from "@mantine/core"
import { FC } from "react"
import { ClientType } from "../../../types/ClientType"
import { truncString } from "../../../utils/truncString"

const ClientListItem: FC<{
  onChange?: (product: Partial<ClientType>) => void
  value: Partial<ClientType>
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
        <Avatar radius="xl"></Avatar>
        <Box sx={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {(value.firstname && value.firstname?.length > 0) ||
            (value.lastname && value.lastname?.length > 0)
              ? truncString(value.firstname + " " + value.lastname, 40)
              : truncString(value.username ? value.username : "", 40)}
          </Text>
          <Text color="dimmed" size="xs">
            {value.email && truncString(value.email, 20)}
            {(value.email || value.companyName) && " | "}
            {value.companyName && truncString(value.companyName, 20)}
          </Text>
        </Box>
      </Group>
    </UnstyledButton>
  )
}

export default ClientListItem
