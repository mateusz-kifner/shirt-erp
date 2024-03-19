import { type Icon, type IconProps } from "@tabler/icons-react";
import { type ForwardRefExoticComponent, type RefAttributes } from "react";

type TablerIconType = ForwardRefExoticComponent<
  Omit<IconProps, "ref"> & RefAttributes<Icon>
>;

export default TablerIconType;
