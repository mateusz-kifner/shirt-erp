import type { EditableContextType, Key } from "@/components/editable/Editable";
import type { ReactNode } from "react";

// export type Key = string | number;

// export interface EditableContextType<TData extends Record<Key, any>> {
//   data: TData;
//   onSubmit?: (key: Key, value: TData[Key]) => void;
//   disabled?: boolean;
// }

interface EditableInput<T, TData extends Record<Key, T> = Record<Key, T>>
  extends Partial<EditableContextType<TData>> {
  label?: string;
  value?: T;
  required?: boolean;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  className?: string;
  keyName?: string | number;
}

export default EditableInput;
