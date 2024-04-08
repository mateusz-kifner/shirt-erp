import type TablerIconType from "@/types/TablerIconType";
import { cn } from "@/utils/cn";
import { useHover } from "@mantine/hooks";
import Link from "next/link";
import { type CSSProperties, useId, type ComponentProps } from "react";
import styles from "./navigation.module.css";

interface NavButtonListItemProps extends ComponentProps<"button"> {
  disableAnimation?: boolean;
  label: string;
  Icon: TablerIconType;
  href: string;
  entryName: string;
  gradient?: { from: string; to: string; deg: number };
  debug?: boolean;
  active?: boolean;
  onClick?: () => void;
}
function NavButtonListItem(props: NavButtonListItemProps) {
  const {
    label,
    href,
    Icon,
    gradient,
    color,
    active,
    onClick,
    disableAnimation = false,
  } = props;
  const { hovered, ref } = useHover<HTMLAnchorElement>();
  const uuid = useId();
  return (
    <Link ref={ref} href={href} id={uuid} onClick={onClick}>
      <div
        className={cn(
          "bold relative flex items-center gap-2 px-[0.875rem] py-1",
        )}
      >
        <div
          className={cn(
            "relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
            styles.icon,
          )}
          style={
            {
              "--bg-gradient": gradient ? gradient.from : color ?? "#0C8599",
              background:
                active || hovered || disableAnimation
                  ? "var(--bg-gradient)"
                  : undefined,
              filter: active || hovered ? "grayscale(80%)" : undefined,
            } as CSSProperties
          }
        >
          <Icon size={36} className="stroke-stone-900 dark:stroke-white" />
        </div>
        <div
          className={cn(
            styles.label,
            "rounded-md px-3 py-1 font-base font-bold",
            !disableAnimation && "fade-out animate-out fill-mode-both",
          )}
          style={{
            background: `linear-gradient(${gradient?.deg ?? 0}deg, ${
              gradient ? gradient.from : color ?? "#0C8599"
            },${gradient ? gradient.to : color ?? "#0C8599"} )`,
            filter: active || hovered ? "grayscale(80%)" : undefined,
          }}
        >
          {label}
        </div>
      </div>
    </Link>
  );
}

export default NavButtonListItem;
