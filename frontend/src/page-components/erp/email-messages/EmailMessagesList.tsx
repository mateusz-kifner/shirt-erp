import {
  Stack,
  Title,
  Group,
  ActionIcon,
  Pagination,
  Box,
  useMantineTheme,
  TextInput,
  Loader,
} from "@mantine/core"
import { useEffect, useState } from "react"
import {
  Plus,
  Refresh,
  Search,
  SortAscending,
  SortDescending,
} from "tabler-icons-react"
import useStrapiList from "../../../hooks/useStrapiList"

import { useGesture } from "@use-gesture/react"
import { useDebouncedValue, useToggle } from "@mantine/hooks"
import List from "../../../components/List"
import { useRouter } from "next/router"
import { capitalize } from "lodash"
import { useTranslation } from "../../../i18n"
import EmailMessageListItem from "./EmailMessageListItem"
import axios from "axios"

const entryName = "email-messages"

interface EmailMessagesListProps<T = any> {
  selectedId: number | null
}

const EmailMessagesList = <T extends any>({
  selectedId,
}: EmailMessagesListProps<T>) => {
  const { t } = useTranslation()
  // const [{ x }, api] = useSpring(() => ({ x: 0 }))
  const [sortOrder, toggleSortOrder] = useToggle<"asc" | "desc">([
    "desc",
    "asc",
  ])
  const [query, setQuery] = useState<string | undefined>("")
  const [debouncedQuery] = useDebouncedValue(query, 200)
  const [page, setPage] = useState<number>(1)
  const { data, meta, refetch, status } = useStrapiList<T[]>(
    entryName,
    page,
    ["subject", "from", "text", "to"],
    debouncedQuery,
    sortOrder,
    {}
  )
  const router = useRouter()

  const onChange = (val: any) => {
    router.push("/erp/" + entryName + "/" + val.id)
  }

  const theme = useMantineTheme()
  const [y, setY] = useState(0)
  const bind = useGesture({
    onDrag: (state) => {
      setY(state.movement[1])
    },
    onDragEnd: (state) => {
      if (state.movement[1] > 50) {
        refetch()
      }

      setTimeout(() => {
        setY(0)
      })
    },
  })
  // const cont = useInRouterContext()
  // const params = router.query
  // const location = useLocation()
  // console.log(params, location, cont)

  // useEffect(() => {
  //   console.log(id, location, cont)
  //   // if (typeof params?.id === "string" && parseInt(params.id) > 0) setId(parseInt(params.id))
  // }, [id, location])

  useEffect(() => {
    refetch()
  }, [selectedId])

  const onChangeWithBlocking = (val: T) => {
    if (y < 10) {
      onChange(val)
    }
  }

  const label = entryName
    ? capitalize(t(`${entryName}.plural` as any))
    : undefined

  return (
    <Stack
      spacing="xl"
      // {...bind()}
      // style={{ touchAction: "none" }}
    >
      <Stack>
        <Group position="apart">
          <Title order={2}>{label}</Title>
          <Group spacing="xs">
            <ActionIcon
              size="lg"
              radius="xl"
              variant="default"
              onClick={() => {
                refetch()
                axios
                  .get(`/api/${entryName}/refresh`)
                  .then((res) => console.log(res.data))
                  .catch((err) => console.log(err))
              }}
            >
              <Refresh />
            </ActionIcon>
            {/* {showAddButton && (
              <ActionIcon
                size="lg"
                radius="xl"
                variant="default"
                onClick={onAddElement}
              >
                <Plus />
              </ActionIcon>
            )} */}
          </Group>
        </Group>
        <Group spacing="md" px="sm">
          <Group>
            <ActionIcon
              size="lg"
              radius="xl"
              variant="default"
              onClick={() => toggleSortOrder()}
            >
              {sortOrder === "asc" ? <SortAscending /> : <SortDescending />}
            </ActionIcon>
          </Group>
          {/* <Autocomplete
            placeholder="Search"
            radius="xl"
            // size="md"
            icon={<Search />}
            data={[]}
            style={{ flexGrow: 1 }}
            value={query}
            onChange={(value) => {
              setQuery(value)
              console.log(value)
            }}
          /> */}
          <TextInput
            defaultValue={""}
            onChange={(value) => setQuery(value.target.value)}
            radius="xl"
            icon={<Search />}
            style={{ flexGrow: 1 }}
          />
        </Group>
      </Stack>
      <Stack spacing={0}>
        <Box
          style={{
            height: y > 100 ? 100 : y,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Loader
            style={{
              position: "absolute",
              left: "50%",
              transform: "translate(-50%,0)",
            }}
          />
        </Box>
        <List<T>
          data={data}
          ListItem={EmailMessageListItem}
          onChange={onChangeWithBlocking}
          selectedId={selectedId}
        />
      </Stack>
      <Pagination
        total={meta?.pagination?.pageCount ? meta.pagination.pageCount : 1}
        initialPage={meta?.pagination?.page ? meta.pagination.page : 1}
        size="lg"
        radius="xl"
        position="center"
        onChange={setPage}
      />
    </Stack>
  )
}

export default EmailMessagesList
