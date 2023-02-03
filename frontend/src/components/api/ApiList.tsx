import {
  Stack,
  Title,
  Group,
  Autocomplete,
  ActionIcon,
  Pagination,
  Box,
  useMantineTheme,
  MantineNumberSize,
  TextInput,
  Loader,
} from "@mantine/core"
import { ReactNode, useEffect, useState } from "react"
import {
  Plus,
  Refresh,
  Search,
  SortAscending,
  SortDescending,
} from "tabler-icons-react"
import useStrapiList from "../../hooks/useStrapiList"

import { useGesture } from "@use-gesture/react"
import { useDebouncedValue, useToggle } from "@mantine/hooks"
import List from "../List"

interface ApiListProps<T = any> {
  entryName: string
  ListItem: React.ElementType
  label?: string | ReactNode
  listSpacing?: MantineNumberSize
  spacing?: MantineNumberSize
  withSeparators?: boolean
  onChange?: (val: T) => void
  onRefresh?: () => void
  listItemProps?: { linkTo: (val: T) => string } | any
  selectedId?: number | null
  filterKeys?: string[]
  exclude?: { [key: string]: string }
  onAddElement?: () => void
  defaultSearch?: string
  showAddButton?: boolean
  buttonSection?: ReactNode
}

const ApiList = <T extends any>({
  entryName,
  ListItem,
  label = "",
  listSpacing = "sm",
  spacing = "xl",
  withSeparators = false,
  onChange = (val: T) => {},
  onRefresh = () => {},
  listItemProps = {},
  selectedId,
  filterKeys,
  exclude,
  onAddElement,
  defaultSearch,
  showAddButton,
  buttonSection,
}: ApiListProps<T>) => {
  // const [{ x }, api] = useSpring(() => ({ x: 0 }))
  const [sortOrder, toggleSortOrder] = useToggle<"asc" | "desc">([
    "desc",
    "asc",
  ])
  const [query, setQuery] = useState<string | undefined>(defaultSearch)
  const [debouncedQuery] = useDebouncedValue(query, 200)
  const [page, setPage] = useState<number>(1)
  const { data, meta, refetch, status } = useStrapiList<T[]>(
    entryName,
    page,
    filterKeys,
    debouncedQuery,
    sortOrder,
    { exclude }
  )

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

  return (
    <Stack
      spacing={spacing}
      // {...bind()}
      // style={{ touchAction: "none" }}
    >
      <Stack>
        <Group position="apart">
          <Title order={2}>{label}</Title>
          <Group spacing="xs">
            {!!buttonSection && buttonSection}
            <ActionIcon
              size="lg"
              radius="xl"
              variant="default"
              onClick={() => {
                refetch()
                onRefresh?.()
              }}
            >
              <Refresh />
            </ActionIcon>
            {showAddButton && (
              <ActionIcon
                size="lg"
                radius="xl"
                variant="default"
                onClick={onAddElement}
              >
                <Plus />
              </ActionIcon>
            )}
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
            defaultValue={defaultSearch}
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
          ListItem={ListItem}
          withSeparators={withSeparators}
          onChange={onChangeWithBlocking}
          selectedId={selectedId}
          listItemProps={listItemProps}
          listSpacing={listSpacing}
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

export default ApiList
