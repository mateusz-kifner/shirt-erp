import {
  Container,
  Paper,
  ScrollArea,
  Text,
  Stack,
  Title,
  Group,
  Autocomplete,
  ActionIcon,
  Box,
  Pagination,
} from "@mantine/core"
import { FC, useState } from "react"
import { Plus, Refresh, Search, SortAscending } from "tabler-icons-react"
import useStrapiList from "../../hooks/useStrapiList"

interface ProductsListProps {
  entryName: string
  ListItem: React.ElementType
}

const ProductsList: FC<ProductsListProps> = ({ entryName, ListItem }) => {
  const [page, setPage] = useState<number>(1)
  const { data, meta, refetch } = useStrapiList(entryName, page)
  console.log(data, meta)
  return (
    <ScrollArea style={{ height: "100%", width: "100%" }}>
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
        <Stack>
          <Stack>
            <Group position="apart">
              <Title order={2}>Products</Title>
              <Group spacing="xs">
                <ActionIcon size="lg" radius="xl" variant="default">
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
          {data &&
            data.map((val: any, index: number) => (
              <ListItem
                {...val.attributes}
                key={`list_${entryName}_${index}`}
              />
            ))}
          <Pagination
            total={
              meta?.pagination?.pageCount ? meta?.pagination?.pageCount : 1
            }
            initialPage={meta?.pagination?.page ? meta?.pagination?.page : 1}
            size="lg"
            radius="xl"
            position="center"
            onChange={setPage}
          />
        </Stack>
      </Paper>
    </ScrollArea>
  )
}

export default ProductsList
