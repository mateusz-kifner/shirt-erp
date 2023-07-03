import { FC, SVGAttributes } from "react"

interface IconProps extends SVGAttributes<SVGElement> {
  color?: string
  size?: string | number
}

type TablerIconType = FC<IconProps>
export default TablerIconType
