import {
  Avatar,
  Box,
  Group,
  UnstyledButton,
  useMantineTheme,
  Text,
} from "@mantine/core"
import { FC } from "react"
import { UserType } from "../../types/UserType"
import { truncString } from "../../utils/truncString"

const UserListItem: FC<{
  onChange?: (user: Partial<UserType>) => void
  value: Partial<UserType>
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
        {value ? (
          <>
            <Avatar radius="xl"></Avatar>
            <Box sx={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {value?.username && truncString(value.username, 40)}
              </Text>
              <Text color="dimmed" size="xs">
                {value?.email && truncString(value.email, 20)}
              </Text>
            </Box>
          </>
        ) : (
          <Text size="sm" weight={500} style={{ flexGrow: 1 }}>
            Brak
          </Text>
        )}
      </Group>
    </UnstyledButton>
  )
}

export default UserListItem
