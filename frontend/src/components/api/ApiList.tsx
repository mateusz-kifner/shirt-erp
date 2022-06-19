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
} from "@mantine/core"
import { FC, useState } from "react"
import { Plus, Refresh, Search, SortAscending } from "../../utils/TablerIcons"
import useStrapiList from "../../hooks/useStrapiList"

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
  const [page, setPage] = useState<number>(1)
  const { data, meta, refetch } = useStrapiList(entryName, page)
  const theme = useMantineTheme()

  return (
    <Stack spacing={spacing}>
      <Stack>
        {/* <Group position="apart">
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
        </Group>*/}
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
