import { createContext, useContext, type ReactNode } from "react";

export interface EditableContextType {
  data: Record<string, any>;
  onSubmit?: (key: string | number, value: any) => void;
  disabled?: boolean;
}

export const EditableContext = createContext<EditableContextType>({
  data: {},
  onSubmit: () => console.log("Not ready yet"),
  disabled: false,
});

export function Editable<T extends Record<string, any>>(props: {
  children: ReactNode;
  data: T;
  onSubmit?: (key: string | number, value: any) => void;
  disabled?: boolean;
}) {
  const { children, disabled = false, ...moreProps } = props;

  return (
    <EditableContext.Provider value={{ ...moreProps, disabled }}>
      {children}
    </EditableContext.Provider>
  );
}

export function useEditableContextWithoutOverride(): EditableContextType {
  const state = useContext(EditableContext);
  return state;
}

export function useEditableContext<
  TValue,
  TData extends Record<string | number, TValue>,
>(props: {
  data?: TData;
  onSubmit?: (key: string | number, value: TValue) => void;
  keyName?: string | number;
}): EditableContextType & { keyName: string | number; value: TValue } {
  const keyName = props?.keyName;
  if (keyName === undefined) throw new Error("keyName not defined");
  const state = useContext(EditableContext);
  const data = props.data ?? state.data;
  const onSubmit = props.onSubmit ?? state.onSubmit;
  const value = data[keyName];
  return { data, onSubmit, keyName, value };
}

export { Editable as default };
