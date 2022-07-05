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
  LoadingOverlay,
} from "@mantine/core"
import { FC, useEffect, useState } from "react"
import {
  Direction,
  Plus,
  Refresh,
  Search,
  SortAscending,
} from "tabler-icons-react"
import useStrapiList from "../../hooks/useStrapiList"
import {
  matchRoutes,
  useInRouterContext,
  useLocation,
  useParams,
} from "react-router-dom"
import { useDrag, useGesture } from "@use-gesture/react"

interface ApiListProps {
  entryName: string
  ListItem: React.ElementType
  label?: string
  listSpacing?: MantineNumberSize
  spacing?: MantineNumberSize
  withSeparators?: boolean
  onChange?: (val: any) => void
  listItemProps?: any
  entryId?: number | null
}

const ApiList: FC<ApiListProps> = ({
  entryName,
  ListItem,
  label = "",
  listSpacing = "md",
  spacing = "md",
  withSeparators = false,
  onChange = (val: any) => {},
  listItemProps = {},
  entryId,
}) => {
  // const [{ x }, api] = useSpring(() => ({ x: 0 }))

  const [page, setPage] = useState<number>(1)
  const { data, meta, refetch, status } = useStrapiList(entryName, page)
  const theme = useMantineTheme()
  const bind = useGesture({
    onDragEnd: (state) => {
      if (state.direction[1] > 0) refetch()
    },
  })
  // const cont = useInRouterContext()
  // const params = useParams()
  // const location = useLocation()
  // console.log(params, location, cont)

  // useEffect(() => {
  //   console.log(id, location, cont)
  //   // if (params?.id && parseInt(params.id) > 0) setId(parseInt(params.id))
  // }, [id, location])

  return (
    <Stack spacing={spacing}>
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
            <ActionIcon size="lg" radius="xl" variant="default">
              <Plus />
            </ActionIcon>
          </Group>
        </Group>
        <Group spacing="md" px="sm">
          <Group>
            <ActionIcon size="lg" radius="xl" variant="default">
              <SortAscending />
            </ActionIcon>
          </Group>
          <Autocomplete
            placeholder="Search"
            radius="xl"
            // size="md"
            icon={<Search />}
            data={[]}
            style={{ flexGrow: 1 }}
          />
        </Group>
      </Stack>
      <Stack spacing={listSpacing} {...bind()}>
        <LoadingOverlay visible={status === "loading"} />
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
                highlight={val.id === entryId}
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
