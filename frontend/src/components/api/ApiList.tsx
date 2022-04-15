import {
  Paper,
  ScrollArea,
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
import { Plus, Refresh, Search, SortAscending } from "tabler-icons-react"
import useStrapiList from "../../hooks/useStrapiList"

interface ApiListProps {
  entryName: string
  ListItem: React.ElementType
  listSpacing?: MantineNumberSize
  spacing?: MantineNumberSize
  withSeparators?: boolean
}

const ApiList: FC<ApiListProps> = ({
  entryName,
  ListItem,
  listSpacing = "md",
  spacing = "md",
  withSeparators = false,
}) => {
  const [page, setPage] = useState<number>(1)
  const { data, meta, refetch } = useStrapiList(entryName, page)
  const theme = useMantineTheme()

  return (
    // <ScrollArea style={{ height: "100%", width: "100%" }} py={py}>
    <Paper
      shadow="xs"
      withBorder
      p="xl"
      sx={(theme) => ({
        borderRadius: theme.spacing.xl,
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          borderRadius: 0,
        },
      })}
    >
      <Stack spacing={spacing}>
        <Stack>
          <Group position="apart">
            <Title order={2}>Products</Title>
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
          <Group spacing="xs">
            <Autocomplete
              placeholder="Search"
              radius="xl"
              size="md"
              icon={<Search />}
              data={[]}
              style={{ flexGrow: 1 }}
            />
            <Group>
              <ActionIcon size="lg" radius="xl" variant="default">
                <SortAscending />
              </ActionIcon>
            </Group>
          </Group>
        </Stack>
        <Stack spacing={listSpacing}>
          {data &&
            data.map((val: any, index: number) => (
              <Box
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
                  {...val.attributes}
                  key={`list_${entryName}_${index}`}
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
    </Paper>
    // </ScrollArea>
  )
}

export default ApiList
