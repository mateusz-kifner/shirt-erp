import type { ReactNode } from "react";

import {
  getRandomColorByNumber,
  getRandomColorByString,
} from "@/utils/getRandomColor";
import Button from "./ui/Button";

interface DefaultListItemProps<T> {
  onChange?: (item: T) => void;
  value: T;
  firstElement?: ReactNode;
  secondElement?: ReactNode;
  avatarElement?: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  active?: boolean;
  disabled?: boolean;
}

export function DefaultListItem<T extends { id?: number | string | null }>({
  value,
  onChange,
  firstElement,
  secondElement,
  avatarElement,
  leftSection,
  rightSection,
  active,
  disabled,
}: DefaultListItemProps<T>) {
  return (
    <Button
      variant="ghost"
      className={`
        flex
        h-14
        flex-grow
        rounded
        border-none px-2
        py-0
        ${active ? "bg-black/10 dark:bg-white/10" : ""}`}
      disabled={disabled}
      onClick={() => onChange?.(value)}
      leftSection={leftSection}
      rightSection={rightSection}
    >
      {value && (
        <div
          className="
            flex 
            h-10 w-10 
            select-none 
            items-center 
            justify-center 
            rounded-full 
            text-base 
            font-bold 
            text-stone-800 
            dark:text-stone-200"
          style={{
            background: `radial-gradient(circle, transparent 58%, ${
              typeof value.id === "number"
                ? getRandomColorByNumber(value.id)
                : getRandomColorByString(value.id)
            }  60%)`,
          }}
        >
          {avatarElement ? avatarElement : " "}
        </div>
      )}
      <div className="flex flex-grow flex-col items-start gap-2">
        <span className="text-sm text-stone-800 dark:text-stone-200">
          {!!firstElement && firstElement}
        </span>
        <span className="text-xs text-stone-600 dark:text-stone-400">
          {!!secondElement && secondElement}
        </span>
      </div>
    </Button>
  );
}
