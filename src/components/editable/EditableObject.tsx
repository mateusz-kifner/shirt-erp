import { ReactNode, useId } from "react";
import Editable, { useEditableContextWithoutOverride } from "./Editable";
import { Label } from "../ui/Label";

interface EditableObjectProps {
  children: ReactNode;
  data?: Record<string | number, any>;
  onSubmit?: (key: string | number, value: any) => void;
  keyName?: string | number;
  className?: string;
  label?: string;
}

function EditableObject(props: EditableObjectProps) {
  const { children, keyName, className, label } = props;
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

  return (
    <>
      <Label label={label} />
      <Editable onSubmit={onSubmit} data={data}>
        {children}
      </Editable>
    </>
  );
}

export default EditableObject;
