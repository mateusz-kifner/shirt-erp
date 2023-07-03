import { getRandomColorByNumber } from "@/utils/getRandomColor";
import { truncString } from "@/utils/truncString";

interface DefaultListItemWithValueProps<T> {
  onChange?: (item: T) => void;
  value: T;
  entryKey?: string;
  entryKey2?: string;
  active?: boolean;
  disabled?: boolean;
}

export function makeDefaultListItem<
  T extends { id?: number | null; [key: string]: any }
>(entryKey?: string, entryKey2?: string) {
  const ListItem = (
    props: Omit<DefaultListItemWithValueProps<T>, "entryKey">
  ) => (
    <DefaultListItemWithValue<T>
      {...props}
      entryKey={entryKey}
      entryKey2={entryKey2}
    />
  );
  return ListItem;
}

export function DefaultListItemWithValue<
  T extends { id?: number | null; [key: string]: any }
>({
  value,
  onChange,
  entryKey,
  entryKey2,
  active,
  disabled,
}: DefaultListItemWithValueProps<T>) {
  // start from 1, because 0 is id
  const firstElement: string | null = value
    ? entryKey
      ? value[entryKey]
      : // @ts-ignore
        value[Object.keys(value)[1]]
    : null;
  const secondElement: string | null = value
    ? entryKey2
      ? value[entryKey2]
      : // @ts-ignore
        value[Object.keys(value)[2]]
    : null;

  return (
    <button
      className={`button button-outline h-14 flex-grow rounded border-none px-2
      py-0
            ${
              active
                ? "bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-10"
                : ""
            }`}
      disabled={disabled}
      onClick={() => onChange?.(value)}
    >
      {value && (
        <div
          className="flex h-10 w-10 select-none items-center justify-center rounded-full text-base font-bold text-stone-800 dark:text-stone-200"
          style={{
            background: `radial-gradient(circle, transparent 58%, ${getRandomColorByNumber(
              value.id
            )}  60%)`,
          }}
        >
          {" "}
        </div>
      )}
      <div className="flex flex-grow flex-col items-start gap-2">
        <span className="text-sm text-stone-800 dark:text-stone-200">
          {firstElement ? truncString(firstElement, 40) : "⸺"}
        </span>
        <span className="text-xs text-stone-600 dark:text-stone-400">
          {secondElement && truncString(secondElement, 40)}
        </span>
      </div>
    </button>
  );
}
