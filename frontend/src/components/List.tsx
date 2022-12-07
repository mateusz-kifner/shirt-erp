import { Stack, Box, useMantineTheme, MantineNumberSize } from "@mantine/core"
import { useId } from "react"

interface ListProps<T = any> {
  ListItem: React.ElementType
  listSpacing?: MantineNumberSize
  withSeparators?: boolean
  onChange?: (val: T) => void
  listItemProps?: { linkTo: (val: T) => string } | any
  selectedId?: number | null
  data?: any[]
}

const List = <T extends any>({
  ListItem,
  listSpacing = "sm",
  withSeparators = false,
  onChange = (val: T) => {},
  listItemProps = {},
  selectedId,
  data = [],
}: ListProps<T>) => {
  const theme = useMantineTheme()
  const uuid = useId()

  return (
    <div className="flex flex-col gap-3">
      {data &&
        data.map((val: any, index: number) => (
          <Box
            key={uuid + "_" + index}
            sx={{
              paddingTop:
                withSeparators && index != 0 && typeof listSpacing == "string"
                  ? theme.spacing[listSpacing]
                  : listSpacing,
              borderTop:
                withSeparators && index != 0
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
              active={val.id === selectedId}
            />
          </Box>
        ))}
    </div>
  )
}

export default List
