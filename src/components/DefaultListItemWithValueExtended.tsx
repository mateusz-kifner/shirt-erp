/* eslint-disable @typescript-eslint/no-explicit-any */
import { truncString } from "@/utils/truncString";
import { DefaultListItemExtended } from "./DefaultListItemExtended";

interface DefaultListItemWithValueExtendedProps<T> {
  onChange?: (item: T) => void;
  value: T;
  entryKey?: string;
  entryKey2?: string;
  active?: boolean;
  disabled?: boolean;
}

export function makeDefaultListItemExtended<
  T extends { id?: number | null; [key: string]: any },
>(entryKey?: string, entryKey2?: string) {
  const ListItem = (
    props: Omit<DefaultListItemWithValueExtendedProps<T>, "entryKey">,
  ) => (
    <DefaultListItemWithValueExtended<T>
      {...props}
      entryKey={entryKey}
      entryKey2={entryKey2}
    />
  );
  return ListItem;
}

export function DefaultListItemWithValueExtended<
  T extends { id?: number | null; [key: string]: any },
>(props: DefaultListItemWithValueExtendedProps<T>) {
  const value = props.value;
  const entryKey = props.entryKey;
  const entryKey2 = props.entryKey2;
  // start from 1, because 0 is id
  const firstElement: string | null = value
    ? entryKey
      ? value[entryKey as keyof typeof value]
      : value[Object.keys(value)[1] as keyof typeof value]
    : null;
  const secondElement: string | null = value
    ? entryKey2
      ? value[entryKey2 as keyof typeof value]
      : value[Object.keys(value)[2] as keyof typeof value]
    : null;

  return (
    <DefaultListItemExtended
      value={value}
      firstElement={firstElement ? truncString(firstElement, 40) : "⸺"}
      secondElement={secondElement && truncString(secondElement, 40)}
    />
  );
}
