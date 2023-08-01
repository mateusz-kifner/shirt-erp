import EditableInput from "@/schema/EditableInput";
import { Children, ReactElement, cloneElement, useId } from "react";

interface EditableProps {
  data: { [key: string]: any };
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
          value: data[keyName as keyof typeof data],
          onSubmit: ((value) =>
            onSubmit?.(keyName, value)) as typeof child.props.onSubmit,
          disabled: disabled || child.props.disabled,
        });
      })}
    </>
  );
}

export default Editable;
