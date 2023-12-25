import {
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useId,
} from "react";
import { useEditableContextWithoutOverride } from "./Editable";
import { Label } from "../ui/Label";
import EditableInput from "@/schema/EditableInput";

// TODO: add delete

interface EditableArrayProps<T> extends EditableInput<T> {
  children:
    | ReactElement
    | ((
        key: string,
        overrideProps: {
          data?: Record<string, any>;
          onSubmit?: (key: string | number, value: T) => void;
          keyName: string | number;
        },
      ) => ReactNode);
}

function EditableArray<T = any>(props: EditableArrayProps<T[]>) {
  const { children, keyName, label, disabled } = props;
  console.log(keyName);
  if (keyName === undefined || typeof keyName === "number")
    throw new Error("keyName not defined");
  const context = useEditableContextWithoutOverride();
  const uuid = useId();
  const data = props?.data?.[keyName] ?? context.data?.[keyName] ?? [];
  const superOnSubmit = props.onSubmit ?? context.onSubmit;
  const onSubmit = (key: string | number, value: any) => {
    if (typeof key === "string")
      throw new Error("EditableArray received string key");
    const newData = [...data];
    newData[key] = value;
    superOnSubmit?.(keyName, newData);
    console.log("Array: ", key, value);
  };
  console.log("Array: ", data);
  if (typeof children === "function" && !isValidElement(children))
    return (
      <div
        className="flex-grow"
        // onClick={() => !disabled && setFocus(true)}
        // onFocus={() => !disabled && setFocus(true)}
        // onBlur={handleBlurForInnerElements(() => setFocus(false))}
        // tabIndex={999999}
      >
        <Label label={label} />

        <div className="flex min-h-[2.75rem] flex-col gap-2">
          <div className=" flex flex-col gap-2">
            {data.length == 0 && "⸺"}

            {data.map((val: any, index: number) => {
              return children(`${uuid}${index}:`, {
                data,
                onSubmit,
                keyName: index,
              });
            })}
            {!disabled && (
              <button
                onClick={() => {
                  onSubmit(data.length, null);
                }}
              >
                +
              </button>
            )}
          </div>
        </div>
      </div>
    );
  return (
    <div
      className="flex-grow"
      // onClick={() => !disabled && setFocus(true)}
      // onFocus={() => !disabled && setFocus(true)}
      // onBlur={handleBlurForInnerElements(() => setFocus(false))}
      // tabIndex={999999}
    >
      <Label label={label} />

      <div className="flex min-h-[2.75rem] flex-col gap-2">
        <div className=" flex flex-col gap-2">
          {data.length == 0 && "⸺"}
          {data.map((val: any, index: number) => {
            return cloneElement(children, {
              keyName: index,
              data,
              onSubmit,
              key: `${uuid}${index}:`,
            });
          })}
          {!disabled && (
            <button
              onClick={() => {
                onSubmit(data.length, null);
              }}
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditableArray;
