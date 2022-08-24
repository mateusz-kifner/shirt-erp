import {
  Avatar,
  Box,
  Group,
  UnstyledButton,
  useMantineTheme,
  Text,
} from "@mantine/core"
import { FC } from "react"
import ApiIconSVG from "../../../components/api/ApiIconSVG"
import { ProductType } from "../../../types/ProductType"
import convert from "color-convert"
import { truncString } from "../../../utils/truncString"

const ProductListItem: FC<{
  onChange?: (product: Partial<ProductType>) => void
  value: Partial<ProductType>
  linkTo?: (val: any) => string
}> = ({ value, onChange, linkTo }) => {
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
      // @ts-ignore
      component={linkTo ? Link : undefined}
      to={linkTo ? linkTo(value) : ""}
    >
      <Group>
        {value ? (
          <>
            <Avatar
              // style={{ backgroundColor: value.attributes.color?.hex }}
              styles={{
                placeholder: { backgroundColor: value?.color?.hex },
              }}
              radius="xl"
            >
              {value?.iconId && (
                <ApiIconSVG
                  entryName="productCategories"
                  id={value?.iconId}
                  color={
                    value?.color?.hex
                      ? convert.hex.hsl(value.color.hex)[2] < 0.5
                        ? "#fff"
                        : "#000"
                      : theme.colorScheme === "dark"
                      ? "#fff"
                      : "#000"
                  }
                  noError
                />
              )}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {value?.name && truncString(value.name, 40)}
              </Text>
              <Text color="dimmed" size="xs">
                {value?.codeName && truncString(value.codeName, 40)}
              </Text>
            </Box>
          </>
        ) : (
          <Text size="sm" weight={500} style={{ flexGrow: 1 }}>
            Brak
          </Text>
        )}
      </Group>
    </UnstyledButton>
  )
}

export default ProductListItem
