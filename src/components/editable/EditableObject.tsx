import { Children, ReactElement, ReactNode, cloneElement, useId } from "react";
import { useEditableContextWithoutOverride } from "./Editable";
import { cn } from "@/utils/cn";

interface EditableObjectProps {
  children:
    | ReactElement
    | ReactElement[]
    | ((overrideProps: {
        data?: Record<string, any>;
        onSubmit?: (key: string | number, value: any) => void;
      }) => ReactNode);
  data?: Record<string | number, any>;
  onSubmit?: (key: string | number, value: any) => void;
  keyName?: string | number;
  className?: string;
}

function EditableObject(props: EditableObjectProps) {
  const { children, keyName, className } = props;
  if (keyName === undefined) throw new Error("keyName not defined");
  const context = useEditableContextWithoutOverride();
  const uuid = useId();
  const data = props?.data?.[keyName] ?? context.data?.[keyName] ?? {};
  const superOnSubmit = props.onSubmit ?? context.onSubmit;
  const onSubmit = (key: string | number, value: any) => {
    if (typeof key === "number")
      throw new Error("EditableObject received number key");
    const newData = { ...data };
    newData[key] = value;
    superOnSubmit?.(keyName, newData);
    console.log("ObjSET: ", key, value);
  };

  if (Array.isArray(children))
    return (
      <div className={cn("flex gap-2", className)}>
        {Children.map(children, (child, index) => {
          return cloneElement(child, {
            data,
            onSubmit,
            key: `${uuid}${index}:`,
          });
        })}
      </div>
    );
  return (
    <div className={cn("flex gap-2", className)}>
      {typeof children === "function"
        ? children({
            data,
            onSubmit,
          })
        : cloneElement(children, {
            data,
            onSubmit,
          })}
    </div>
  );
}

export default EditableObject;
