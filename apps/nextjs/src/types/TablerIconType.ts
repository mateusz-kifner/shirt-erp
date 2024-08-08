import type { Icon, IconProps } from "@tabler/icons-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

type TablerIconType = ForwardRefExoticComponent<
  Omit<IconProps, "ref"> & RefAttributes<Icon>
>;

export default TablerIconType;
