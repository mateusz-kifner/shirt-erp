import { truncString } from "@/utils/truncString";
import { DefaultListItem } from "./DefaultListItem";

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
  entryKey,
  entryKey2,
  ...moreProps
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
    <DefaultListItem
      value={value}
      firstElement={firstElement ? truncString(firstElement, 40) : "⸺"}
      secondElement={secondElement && truncString(secondElement, 40)}
    />
  );
}
