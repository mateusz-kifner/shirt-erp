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
  const gradient_gap = 0.1

  const gradient = useMemo(
    () =>
      colors.reduce((prev, next, index, arr) => {
        const percent_last = (index / colors.length) * 100
        const percent = ((index + 1) / colors.length) * 100
        return (
          prev +
          (index !== 0 ? "," : "") +
          next +
          " " +
          (percent_last + gradient_gap).toFixed(2) +
          "%," +
          next +
          " " +
          percent.toFixed(2) +
          "%"
        )
      }, "conic-gradient(") + ")",
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
              root: {
                transform: "scale(1.2)",
              },
              placeholder: {
                position: "relative",
                "&:before": {
                  content: "''",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  borderRadius: "100%",
                  background: gradient,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 100%",
                  maskImage:
                    "radial-gradient(circle, transparent 54%, black  56%)",
                },
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
