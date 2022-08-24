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
} from "@mantine/core"
import { FC, useState } from "react"
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

interface ApiListProps<T = any> {
  entryName: string
  ListItem: React.ElementType
  label?: string
  listSpacing?: MantineNumberSize
  spacing?: MantineNumberSize
  withSeparators?: boolean
  onChange?: (val: T) => void
  listItemProps?: { linkTo: (val: T) => string } | any
  selectedId?: number | null
  filterKeys?: string[]
  onAddElement?: () => void
}

const ApiList = <T extends any>({
  entryName,
  ListItem,
  label = "",
  listSpacing = "sm",
  spacing = "xl",
  withSeparators = false,
  onChange = (val: T) => {},
  listItemProps = {},
  selectedId,
  filterKeys,
  onAddElement,
}: ApiListProps<T>) => {
  // const [{ x }, api] = useSpring(() => ({ x: 0 }))
  const [sortOrder, toggleSortOrder] = useToggle<"asc" | "desc">([
    "asc",
    "desc",
  ])
  const [query, setQuery] = useState<string | undefined>(undefined)
  const [debouncedQuery] = useDebouncedValue(query, 200)
  const [page, setPage] = useState<number>(1)
  const { data, meta, refetch, status } = useStrapiList<T[]>(
    entryName,
    page,
    filterKeys,
    debouncedQuery,
    sortOrder
  )

  const theme = useMantineTheme()
  const bind = useGesture({
    onDragEnd: (state) => {
      if (state.direction[1] > 0) refetch()
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

  return (
    <Stack spacing={spacing} {...bind()}>
      <Stack>
        <Group position="apart">
          <Title order={2}>{label}</Title>
          <Group spacing="xs">
            <ActionIcon
              size="lg"
              radius="xl"
              variant="default"
              onClick={() => refetch()}
            >
              <Refresh />
            </ActionIcon>
            <ActionIcon
              size="lg"
              radius="xl"
              variant="default"
              onClick={onAddElement}
            >
              <Plus />
            </ActionIcon>
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
            onChange={(value) => setQuery(value.target.value)}
            radius="xl"
            icon={<Search />}
            style={{ flexGrow: 1 }}
          />
        </Group>
      </Stack>
      <Stack spacing={listSpacing}>
        {data &&
          data.map((val: any, index: number) => (
            <Box
              key={`list_${entryName}_${index}`}
              sx={{
                paddingTop:
                  index != 0 && typeof listSpacing == "string"
                    ? theme.spacing[listSpacing]
                    : listSpacing,
                borderTop:
                  index != 0
                    ? `1px solid ${
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[4]
                          : theme.colors.gray[2]
                      }`
                    : undefined,
              }}
            >
              <ListItem
                value={val}
                onChange={onChange}
                {...listItemProps}
                highlight={val.id === selectedId}
              />
            </Box>
          ))}
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
