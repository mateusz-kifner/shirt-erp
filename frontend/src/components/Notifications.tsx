import {
  Title,
  Text,
  Stack,
  ActionIcon,
  Popover,
  useMantineTheme,
  Group,
  Indicator,
} from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import React, { useEffect, useId, useState } from "react"
import { Bell } from "tabler-icons-react"
import { useAuthContext } from "../context/authContext"
import useStarpiUser from "../hooks/useStrapiUser"
import OrderListItem from "../page-components/erp/orders/OrderListItem"

const Notifications = () => {
  const { isAuthenticated } = useAuthContext()
  const [opened, setOpened] = useState<boolean>()
  const [prevActiveOrders, setPrevActiveOrders] = useLocalStorage<number>({
    key: "prevActiveOrders",
    defaultValue: 0,
  })
  const uuid = useId()
  const todayDate = dayjs().format("YYYY-MM-DD")
  const theme = useMantineTheme()
  const { data, refetch } = useStarpiUser({
    queryOptions: { enabled: isAuthenticated },
  })
  const router = useRouter()
  const activeOrders = data?.orders
    ? data?.orders.filter((val) => {
        const timeLeft = val?.dateOfCompletion
          ? dayjs(val?.dateOfCompletion).diff(todayDate, "day")
          : null
        return (
          !(
            val?.status === "rejected" ||
            val?.status === "archived" ||
            val?.status === "sent"
          ) &&
          timeLeft !== null &&
          timeLeft < 7 &&
          timeLeft > -1
        )
      }).length
    : 0

  useEffect(() => {
    if (prevActiveOrders < activeOrders) {
      const audio = new Audio("/notification.ogg")
      audio.loop = false
      audio.play().catch(() => {})
    }
    setPrevActiveOrders(activeOrders)
  }, [activeOrders])
  return (
    <Popover
      width={400}
      position="bottom-end"
      arrowOffset={12}
      offset={4}
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <ActionIcon
          size="lg"
          radius="xl"
          color={theme.colorScheme === "dark" ? "gray" : "dark"}
          variant={theme.colorScheme === "dark" ? "default" : "filled"}
          onClick={() => {
            refetch()
            setOpened((val) => !val)
          }}
        >
          <Indicator
            position="bottom-end"
            color="blue"
            disabled={activeOrders == 0}
          >
            <Bell />
          </Indicator>
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <Group position="apart">
            <Title order={3}>
              <Bell size={18} /> Powiadomienia{" "}
            </Title>
          </Group>

          {activeOrders ? (
            data?.orders
              .sort((a, b) =>
                dayjs(a.dateOfCompletion).diff(dayjs(b.dateOfCompletion))
              )
              .map((val, index) => {
                const timeLeft = val?.dateOfCompletion
                  ? dayjs(val?.dateOfCompletion).diff(todayDate, "day")
                  : null
                if (
                  !(
                    val?.status === "rejected" ||
                    val?.status === "archived" ||
                    val?.status === "sent"
                  ) &&
                  timeLeft !== null &&
                  timeLeft < 7 &&
                  timeLeft > -1
                ) {
                  return (
                    <OrderListItem
                      value={val}
                      onChange={(val) => {
                        router.push("/erp/tasks/" + val.id)
                        setOpened(false)
                      }}
                      key={uuid + index}
                    />
                  )
                }
                return null
              })
          ) : (
            <Text size="sm">Brak powiadomień</Text>
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default Notifications
