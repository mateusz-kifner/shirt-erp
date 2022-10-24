import { Avatar, NavLink } from "@mantine/core"
import ApiIconSVG from "../../../components/api/ApiIconSVG"
import { ProductType } from "../../../types/ProductType"
import { truncString } from "../../../utils/truncString"
import { useMemo } from "react"

// FIXME: COLORS not working

interface ProductListItemProps {
  onChange?: (item: Partial<ProductType>) => void
  value: Partial<ProductType>
  active?: boolean
  disabled?: boolean
  linkTo?: (val: Partial<ProductType>) => string
}

const ProductListItem = ({
  value,
  onChange,
  active,
  disabled,
  linkTo,
}: ProductListItemProps) => {
  const colors: string[] = Array.isArray(value?.variants?.colors)
    ? value?.variants?.colors
    : []
  const gradient_gap = 5

  const gradient = useMemo(
    () =>
      colors.reduce((prev, next, index, arr) => {
        const percent_last = (index / (colors.length + 1)) * 100
        const percent = ((index + 1) / (colors.length + 1)) * 100
        return (
          prev +
          "," +
          next +
          " " +
          (percent_last + gradient_gap).toFixed(2) +
          "%," +
          next +
          " " +
          percent.toFixed(2) +
          "%"
        )
      }, "linear-gradient(217deg") + ")",
    [colors]
  )

  return (
    <NavLink
      disabled={disabled}
      icon={
        value && (
          <Avatar
            // style={{ background: gradient }}
            styles={{
              placeholder: {
                background: gradient,
                backgroundRepeat: "no-repeat",
                backgroundSize: "110% 110%",
                backgroundPosition: "30% 30%",
              },
            }}
            radius="xl"
          >
            {value?.iconId && (
              <ApiIconSVG
                entryName="productCategories"
                id={value?.iconId}
                noError
              />
            )}
          </Avatar>
        )
      }
      label={value ? value?.name && truncString(value.name, 20) : "⸺"}
      // description={value?.codeName && truncString(value.codeName, 40)}
      onClick={() => onChange?.(value)}
      active={active}
      // @ts-ignore
      component={linkTo ? Link : undefined}
      to={linkTo ? linkTo(value) : ""}
    />
  )
}

export default ProductListItem
