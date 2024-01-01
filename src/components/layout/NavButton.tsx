import type TablerIconType from "@/schema/TablerIconType";
import { cn } from "@/utils/cn";
import { useHover } from "@mantine/hooks";
import Link from "next/link";
import { useId, type ComponentProps, type ComponentType } from "react";

interface NavButtonProps extends ComponentProps<"button"> {
  className?: string;
  label: string;
  Icon: TablerIconType;
  href: string;
  entryName: string;
  gradient?: { from: string; to: string; deg: number };
  debug?: boolean;
  active?: boolean;
  onClick: () => void;
}

function NavButton(props: NavButtonProps) {
  const { label, href, Icon, gradient, color, active, onClick } = props;
  const { hovered, ref } = useHover<HTMLAnchorElement>();
  const uuid = useId();
  return (
    <Link ref={ref} href={href} id={uuid} onClick={onClick}>
      <div
        className={cn("bold flex flex-col items-center py-2 text-xs")}
        style={{
          background:
            active || hovered
              ? `linear-gradient(${gradient?.deg ?? 0}deg, ${
                  gradient ? gradient.from : color ?? "#0C8599"
                },${gradient ? gradient.to : color ?? "#0C8599"} )`
              : "transparent",
        }}
      >
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full">
          <Icon
            size={32}
            className="stroke-stone-900 dark:stroke-white"
            key={"inner" + uuid}
            id={"inner" + uuid}
          />
        </div>
        {label}
      </div>
    </Link>
  );
}

export default NavButton;
