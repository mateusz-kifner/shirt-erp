/* eslint-disable @typescript-eslint/no-explicit-any */
import type EditableInput from "@/schema/EditableInput";
import { Children, type ReactElement, cloneElement, useId } from "react";

interface EditableProps {
  data: Record<string, any>;
  onSubmit?: (key: string, value: any) => void;
  children:
    | ReactElement<EditableInput<any>>[]
    | ReactElement<EditableInput<any>>;
  disabled?: boolean;
}

function Editable(props: EditableProps) {
  const { data, onSubmit, children, disabled } = props;
  const uuid = useId();

  return (
    <>
      {Children.map(children, (child, index) => {
        const keyName = child.props.keyName;
        if (keyName === undefined || !Object.keys(data).includes(keyName))
          return child;
        return cloneElement(child, {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value: data[keyName],
          onSubmit: ((value) => {
            onSubmit?.(keyName, value);
            child.props?.onSubmit?.(value);
          }) as typeof child.props.onSubmit,
          disabled: disabled || child.props.disabled,
          key: `${uuid}${index}`,
        });
      })}
    </>
  );
}

export default Editable;
