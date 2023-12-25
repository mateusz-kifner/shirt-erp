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
import Button from "../ui/Button";
import { IconPlus, IconTrashX } from "@tabler/icons-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/ContextMenu";
import useTranslation from "@/hooks/useTranslation";

// TODO: add delete

interface EditableArrayProps<T> extends EditableInput<T[]> {
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

function EditableArrayWrapper(props: { label?: string; children: ReactNode }) {
  return (
    <div className="flex-grow">
      <Label label={props.label} />

      <div className="flex min-h-[2.75rem] flex-col gap-2">
        <div className=" flex flex-col gap-2">{props.children}</div>
      </div>
    </div>
  );
}

function EditableArray<T = any>(props: EditableArrayProps<T>) {
  const { children, keyName, label, disabled } = props;
  const t = useTranslation();
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

  const onDelete = (index: number) => {
    console.log(data, index);
    const newData = data.filter((_: any, i: number) => i !== index);
    superOnSubmit?.(keyName, newData);
  };
  console.log("Array: ", data);
  if (typeof children === "function" && !isValidElement(children))
    return (
      <EditableArrayWrapper label={label}>
        {data.length == 0 && "⸺"}

        {data.map((_: any, index: number) => {
          return (
            <ContextMenu>
              <ContextMenuTrigger>
                {children(`${uuid}${index}:`, {
                  data,
                  onSubmit,
                  keyName: index,
                })}
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  className="flex items-center gap-2 focus:bg-destructive focus:text-destructive-foreground"
                  onClick={() => onDelete(index)}
                >
                  <IconTrashX /> {t.delete}
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
        {!disabled && (
          <Button
            variant="ghost"
            onClick={() => {
              onSubmit(data.length, null);
            }}
          >
            <IconPlus />
          </Button>
        )}
      </EditableArrayWrapper>
    );
  return (
    <EditableArrayWrapper label={label}>
      {data.length == 0 && "⸺"}
      {data.map((_: any, index: number) => {
        return (
          <ContextMenu>
            <ContextMenuTrigger>
              {cloneElement(children, {
                keyName: index,
                data,
                onSubmit,
                key: `${uuid}${index}:`,
              })}
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                className="flex items-center gap-2 focus:bg-destructive focus:text-destructive-foreground"
                onClick={() => onDelete(index)}
              >
                <IconTrashX /> {t.delete}
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        );
      })}
      {!disabled && (
        <Button
          variant="ghost"
          onClick={() => {
            onSubmit(data.length, null);
          }}
        >
          <IconPlus />
        </Button>
      )}
    </EditableArrayWrapper>
  );
}

export default EditableArray;
