import { useId, type ButtonHTMLAttributes, type ComponentType } from "react";

import type TablerIconType from "@/types/TablerIconType";
import Link from "next/link";

interface NavButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  small?: boolean;
  label: string;
  Icon: TablerIconType;
  href: string;
  entryName: string;
  gradient?: { from: string; to: string; deg: number };
  SecondNavigation?: ComponentType;
  debug?: boolean;
  active?: boolean;
}

function NavButton(props: NavButtonProps) {
  const { label, href, Icon, gradient, color, active, small } = props;
  const uuid = useId();
  return (
    <Link
      href={href}
      id={uuid}
      className={`bg-black 
      bg-opacity-0 p-2 transition-all hover:bg-opacity-10 active:hover:scale-95 active:hover:animate-none
      active:focus:scale-95  active:focus:animate-none disabled:pointer-events-none 
      disabled:bg-stone-700 dark:bg-white 
       dark:text-gray-200 dark:hover:bg-opacity-10 ${
         active
           ? "bg-opacity-10 dark:bg-opacity-10"
           : "bg-opacity-0 dark:bg-opacity-0"
       } overflow-hidden rounded-full `}
    >
      <div className="flex w-64 items-center gap-3 text-sm">
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
