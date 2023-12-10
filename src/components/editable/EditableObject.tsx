import { Children, ReactElement, ReactNode, cloneElement, useId } from "react";
import { useEditableContextWithoutOverride } from "./Editable";

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
}

function EditableObject(props: EditableObjectProps) {
  const { children, keyName } = props;
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
      <div className="flex gap-2">
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
    <div className="flex gap-2">
      {typeof children === "function" ? (
        <div className="flex gap-2">
          {children({
            data,
            onSubmit,
          })}
        </div>
      ) : (
        cloneElement(children, {
          data,
          onSubmit,
        })
      )}
    </div>
  );
}

export default EditableObject;
