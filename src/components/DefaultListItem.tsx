import type { ReactNode } from "react";

import { getRandomColorByNumber } from "@/utils/getRandomColor";

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

export function DefaultListItem<T extends { id?: number | null }>({
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
    <button
      className={`button button-outline h-14 flex-grow rounded border-none px-2
      py-0
        ${active ? "bg-gray-200 dark:bg-neutral-700" : ""}`}
      disabled={disabled}
      onClick={() => onChange?.(value)}
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
            background: `radial-gradient(circle, transparent 58%, ${getRandomColorByNumber(
              value.id
            )}  60%)`,
          }}
        >
          {avatarElement ? avatarElement : " "}
        </div>
      )}
      {!!leftSection && leftSection}
      <div className="flex flex-grow flex-col items-start gap-2">
        <span className="text-sm text-stone-800 dark:text-stone-200">
          {!!firstElement && firstElement}
        </span>
        <span className="text-xs text-stone-600 dark:text-stone-400">
          {!!secondElement && secondElement}
        </span>
      </div>
      {!!rightSection && rightSection}
    </button>
  );
}
