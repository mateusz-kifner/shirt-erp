import {
  Avatar,
  Box,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core"
import { FC } from "react"
import { ProductType } from "../../types/ProductType"

import ApiList from "../../components/api/ApiList"
import ApiEntryDetails from "../../components/api/ApiEntryDetails"
import ApiEntryAdd from "../../components/api/ApiEntryAdd"
import product_schema from "../../schemas/product.schema.json"
import { StrapiEntryType } from "../../types/StrapiEntryType"
import ApiIconSVG from "../../components/api/ApiIconSVG"
import convert from "color-convert"

const ProductsPage: FC = () => {
  // console.log(product_schema)
  return (
    <Group
      sx={(theme) => ({
        flexWrap: "nowrap",
        alignItems: "flex-start",
        padding: theme.spacing.xl,
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          padding: 0,
        },
      })}
    >
      <Paper
        shadow="xs"
        withBorder
        p="xl"
        sx={(theme) => ({
          borderRadius: theme.spacing.xl,
          minWidth: 420,
          [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            borderRadius: 0,
          },
        })}
      >
        <ApiList
          ListItem={ProductListItem}
          entryName="products"
          label="Products"
          spacing="xl"
          listSpacing="sm"
          onChange={(val: StrapiEntryType<any>) => {
            console.log(val)
          }}
        />
      </Paper>

      <Paper
        shadow="xs"
        withBorder
        p="xl"
        sx={(theme) => ({
          borderRadius: theme.spacing.xl,
          height: "100%",

          flexGrow: 1,
          alignSelf: "stretch",
          justifySelf: "stretch",
          [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            borderRadius: 0,
          },
        })}
      >
        <ApiEntryAdd schema={product_schema} />
      </Paper>
    </Group>
  )
}

const ProductListItem: FC<{
  onChange?: (product: StrapiEntryType<Partial<ProductType>>) => void
  value: StrapiEntryType<Partial<ProductType>>
}> = ({ value, onChange }) => {
  const theme = useMantineTheme()

  return (
    <UnstyledButton
      sx={{
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      }}
      onClick={() => onChange && onChange(value)}
    >
      <Group>
        <Avatar
          // style={{ backgroundColor: value.attributes.color?.colorHex }}
          styles={{
            placeholder: { backgroundColor: value.attributes?.color?.colorHex },
          }}
          radius="xl"
        >
          <ApiIconSVG
            entryName="productCategories"
            id={value.attributes.iconId}
            color={
              value.attributes?.color?.colorHex
                ? convert.hex.hsl(value.attributes.color.colorHex)[2] < 0.5
                  ? "#fff"
                  : "#000"
                : theme.colorScheme === "dark"
                ? "#fff"
                : "#000"
            }
          />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {value.attributes.name}
          </Text>
          <Text color="dimmed" size="xs">
            {value.attributes.codeName}
          </Text>
        </Box>

        {/* {theme.dir === "ltr" ? (
          <ChevronRight size={18} />
        ) : (
          <ChevronLeft size={18} />
        )} */}
      </Group>
    </UnstyledButton>
  )
}

export default ProductsPage
