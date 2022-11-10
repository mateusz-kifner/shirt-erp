import {
  Stack,
  Title,
  Group,
  ActionIcon,
  Pagination,
  useMantineTheme,
  MantineNumberSize,
  TextInput,
} from "@mantine/core"
import { useDebouncedValue, useToggle } from "@mantine/hooks"
import { t } from "i18next"
import { capitalize } from "lodash"
import { useEffect, useState } from "react"
import {
  Refresh,
  Search,
  SortAscending,
  SortDescending,
} from "tabler-icons-react"
import List from "../../../components/List"
import useStarpiUser from "../../../hooks/useStrapiUser"
import { useTranslation } from "../../../i18n"
import OrderListItem from "../orders/OrderListItem"

interface ApiListProps<T = any> {
  listSpacing?: MantineNumberSize
  spacing?: MantineNumberSize
  withSeparators?: boolean
  onChange?: (val: T) => void
  listItemProps?: { linkTo: (val: T) => string } | any
  selectedId?: number | null
}

const ApiList = <T extends any>({
  listSpacing = "sm",
  spacing = "xl",
  withSeparators = false,
  onChange = (val: T) => {},
  listItemProps = {},
  selectedId,
}: ApiListProps<T>) => {
  const { t } = useTranslation()
  const pageSize = 20
  const [sortOrder, toggleSortOrder] = useToggle<"asc" | "desc">([
    "desc",
    "asc",
  ])
  const [query, setQuery] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const { data, refetch } = useStarpiUser()

  const theme = useMantineTheme()

  useEffect(() => {
    refetch()
  }, [selectedId])

  const filteredOrders =
    data?.orders
      .filter(
        (value, index) =>
          (!(
            value?.status === "rejected" ||
            value?.status === "archived" ||
            value?.status === "sent"
          ) &&
            value.name?.includes(query)) ||
          value.status?.includes(query) ||
          value.notes?.includes(query) ||
          value.secretNotes?.includes(query) ||
          value.address?.streetName?.includes(query) ||
          value.client?.firstname?.includes(query) ||
          value.client?.lastname?.includes(query)
      )
      .sort(
        (prev, next) =>
          Date.parse(prev?.dateOfCompletion ?? "1970-01-01T00:00:00.000Z") -
          Date.parse(next?.dateOfCompletion ?? "1970-01-01T00:00:00.000Z")
      ) ?? []

  return (
    <Stack spacing={spacing}>
      <Stack>
        <Group position="apart">
          <Title order={2}>{capitalize(t("tasks.plural"))}</Title>
          <Group spacing="xs">
            <ActionIcon
              size="lg"
              radius="xl"
              variant="default"
              onClick={() => refetch()}
            >
              <Refresh />
            </ActionIcon>
          </Group>
        </Group>
        <Group spacing="md" px="sm">
          {/* <Group>
            <ActionIcon
              size="lg"
              radius="xl"
              variant="default"
              onClick={() => toggleSortOrder()}
            >
              {sortOrder === "asc" ? <SortAscending /> : <SortDescending />}
            </ActionIcon>
          </Group> */}

          <TextInput
            defaultValue={""}
            onChange={(value) => setQuery(value.target.value)}
            radius="xl"
            icon={<Search />}
            style={{ flexGrow: 1 }}
          />
        </Group>
      </Stack>
      <List
        data={filteredOrders.filter(
          (_, index) =>
            index < pageSize * page && index >= pageSize * (page - 1)
        )}
        onChange={onChange}
        ListItem={OrderListItem}
        listItemProps={listItemProps}
        listSpacing={listSpacing}
        selectedId={selectedId}
        withSeparators={withSeparators}
      />
      <Pagination
        total={Math.ceil(filteredOrders.length / pageSize)}
        initialPage={1}
        size="lg"
        radius="xl"
        position="center"
        onChange={setPage}
      />
    </Stack>
  )
}

export default ApiList
