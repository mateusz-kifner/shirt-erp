import { Avatar, useMantineTheme, NavLink } from "@mantine/core"
import ApiIconSVG from "../../../components/api/ApiIconSVG"
import { ProductType } from "../../../types/ProductType"
import convert from "color-convert"
import { truncString } from "../../../utils/truncString"

// FIXME: COLORS not working

interface ProductListItemProps {
  onChange?: (item: Partial<ProductType>) => void
  value: Partial<ProductType>
  active?: boolean
  linkTo?: (val: Partial<ProductType>) => string
}

const ProductListItem = ({
  value,
  onChange,
  active,
  linkTo,
}: ProductListItemProps) => {
  const theme = useMantineTheme()

  return (
    <NavLink
      icon={
        value && (
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
        )
      }
      label={value ? value?.name && truncString(value.name, 20) : "⸺"}
      description={value?.codeName && truncString(value.codeName, 40)}
      onClick={() => onChange?.(value)}
      active={active}
      // @ts-ignore
      component={linkTo ? Link : undefined}
      to={linkTo ? linkTo(value) : ""}
    />
  )
}

export default ProductListItem
