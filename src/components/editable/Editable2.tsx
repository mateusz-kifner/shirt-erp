import EditableInput from "@/schema/EditableInput";
import { Children, ReactElement, cloneElement, useId } from "react";
import NotImplemented from "../NotImplemented";

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
          return (
            <NotImplemented
              message={"Component doesn't have a key, and cannot be rendered"}
              object_key={keyName}
              value={Object.keys(child.props)
                .map((key) => {
                  if (
                    typeof child.props[key as keyof typeof child.props] ===
                      "string" ||
                    typeof child.props[key as keyof typeof child.props] ===
                      "number" ||
                    typeof child.props[key as keyof typeof child.props] ===
                      "boolean"
                  ) {
                    return {
                      [key]: child.props[key as keyof typeof child.props],
                    };
                  }
                  return {
                    [key]: `[cannot process type: ${typeof child.props[
                      key as keyof typeof child.props
                    ]}]`,
                  };
                })
                .reduce((prev, next) => ({ ...prev, ...next }), {})}
              key={`:Editable${uuid}${index}:`}
            />
          );
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
