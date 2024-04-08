import type TablerIconType from "@/types/TablerIconType";
import { cn } from "@/utils/cn";
import { useHover } from "@mantine/hooks";
import Link from "next/link";
import { useId, type ComponentProps } from "react";

interface NavButtonProps extends ComponentProps<"button"> {
  className?: string;
  label: string;
  Icon: TablerIconType;
  href: string;
  entryName: string;
  gradient?: { from: string; to: string; deg: number };
  debug?: boolean;
  active?: boolean;
  onClick?: () => void;
}

function NavButton(props: NavButtonProps) {
  const { label, href, Icon, gradient, color, active, onClick } = props;
  const { hovered, ref } = useHover<HTMLAnchorElement>();
  const uuid = useId();
  return (
    <Link ref={ref} href={href} id={uuid} onClick={onClick}>
      <div
        className={cn(
          "bold relative flex h-24 flex-col items-center justify-center gap-1 px-1 text-xs",
        )}
      >
        <div
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-xl",
          )}
          style={{
            background: `linear-gradient(${gradient?.deg ?? 0}deg, ${
              gradient ? gradient.from : color ?? "#0C8599"
            },${gradient ? gradient.to : color ?? "#0C8599"} )`,
            filter: active || hovered ? "grayscale(80%)" : undefined,
          }}
        >
          <Icon size={28} className="stroke-stone-900 dark:stroke-white" />
        </div>
        <div
          className="rounded-md px-3 py-1.5 font-bold"
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

export default NavButton;
