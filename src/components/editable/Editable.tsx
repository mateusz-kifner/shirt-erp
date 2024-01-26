import { createContext, useContext, type ReactNode } from "react";

export type Key = string | number;

export interface EditableContextType<TData extends Record<Key, any>> {
  data: TData;
  onSubmit?: (key: Key, value: TData[Key]) => void;
  disabled?: boolean;
}

export const EditableContext = createContext<EditableContextType<any>>({
  data: {},
  onSubmit: () => console.log("Not ready yet"),
  disabled: false,
});

export interface EditableProps<TData> {
  children: ReactNode;
  data: TData;
  onSubmit?: (key: Key, value: any) => void;
  disabled?: boolean;
}

export function Editable<T extends Record<string, any>>(
  props: EditableProps<T>,
) {
  const { children, disabled = false, ...moreProps } = props;

  return (
    <EditableContext.Provider value={{ ...moreProps, disabled }}>
      {children}
    </EditableContext.Provider>
  );
}

export function useEditableContextWithoutOverride<
  T extends Record<string, any>,
>(): EditableContextType<T> {
  const state = useContext(EditableContext);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return state;
}

export function useEditableContext<
  T extends Record<Key, any> & {
    data?: Record<Key, any>;
    onSubmit?: (key: Key, value: TValue) => void; // initial onSubmit
    keyName?: Key;
    value?: TValue;
  },
  TValue = any, // Need this to coerce onSubmit to have proper value
>(props: T) {
  const {
    data: data_props,
    onSubmit: onSubmit_props,
    keyName,
    ...moreProps
  } = props;
  if (keyName === undefined) throw new Error("keyName not defined");
  const state = useContext(EditableContext);
  const data = data_props ?? state.data;
  const onSubmit = onSubmit_props ?? state.onSubmit;
  const value: TValue = data[keyName];
  return {
    data,
    onSubmit: (value) =>
      !!value &&
      Object.keys(value).length > 1 &&
      onSubmit?.(keyName, value as TValue),
    keyName,
    value,
    ...moreProps,
  } as Omit<T, "onSubmit"> & { onSubmit: (value: T["value"]) => void }; // Simple onSubmit with proper types
}

export { Editable as default };
