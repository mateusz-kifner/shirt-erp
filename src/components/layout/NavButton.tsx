import type TablerIconType from "@/schema/TablerIconType";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useId, type ButtonHTMLAttributes, type ComponentType } from "react";

interface NavButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  label: string;
  Icon: TablerIconType;
  href: string;
  entryName: string;
  gradient?: { from: string; to: string; deg: number };
  SecondNavigation?: ComponentType;
  debug?: boolean;
  active?: boolean;
  small?: boolean;
  onClick: () => void;
}

function NavButton(props: NavButtonProps) {
  const {
    label,
    href,
    Icon,
    gradient,
    color,
    active,
    small = false,
    onClick,
  } = props;
  const uuid = useId();
  return (
    <Link
      href={href}
      legacyBehavior={false}
      id={uuid}
      className={cn(
        `overflow-hidden 
       bg-black bg-opacity-0 p-2 transition-all hover:bg-opacity-10
      active:hover:scale-95  active:hover:animate-none active:focus:scale-95 
      active:focus:animate-none disabled:pointer-events-none 
       disabled:bg-stone-700 dark:bg-white  dark:text-gray-200 dark:hover:bg-opacity-10 `,
        active
          ? "bg-opacity-10 dark:bg-opacity-10"
          : "bg-opacity-0 dark:bg-opacity-0",
        small ? "rounded-md" : "rounded-full",
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "flex  items-center gap-3 text-sm",
          small ? "flex-col" : "w-64",
        )}
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full "
          style={{
            background: `linear-gradient(${gradient?.deg ?? 0}deg, ${
              gradient ? gradient.from : color ?? "#0C8599"
            },${gradient ? gradient.to : color ?? "#0C8599"} )`,
          }}
        >
          <Icon
            size={32}
            className="stroke-white"
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
