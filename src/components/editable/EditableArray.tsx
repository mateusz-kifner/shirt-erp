import { useEffect, useId, useState, type ComponentType } from "react";

import { useListState } from "@mantine/hooks";
import { IconPlus, IconTrashX } from "@tabler/icons-react";
import { isEqual, omit } from "lodash";

import Button from "@/components/ui/Button";

import type EditableInput from "@/types/EditableInput";
import * as RadixContextMenu from "@radix-ui/react-context-menu";
import InputLabel from "../input/InputLabel";

// fixme submit only on edit end

interface EditableArrayProps
  extends Omit<EditableInput<any[]>, "value" | "initialValue"> {
  value?: any[] | null;
  initialValue?: any[] | null;
  newItemValue?: any;
  maxCount?: number;
  Element: ComponentType<any>;
  elementProps: any;
  organizingHandle: "none" | "arrows" | "drag and drop";
  linkEntry: boolean;
  unique: boolean;
}

const EditableArray = (props: EditableArrayProps) => {
  const {
    label,
    value,
    initialValue,
    newItemValue,
    onSubmit,
    disabled,
    required,
    maxCount,
    Element,
    elementProps,
    organizingHandle = "none",
    linkEntry = false,
    unique = true,
  } = props;
  const [items, handlers] = useListState<any>(value ?? initialValue ?? []);
  // const [focus, setFocus] = useState<boolean>(false);
  const [prev, setPrev] = useState<any[]>(items);
  const uuid = useId();

  useEffect(() => {
    const filtered_items = items.filter((val) => !!val);
    if (
      isEqual(
        filtered_items,
        prev.filter((val) => !!val)
      )
    )
      return;
    onSubmit?.(filtered_items);
    // eslint-disable-next-line
  }, [items]);

  useEffect(() => {
    if (value === undefined || value === null) return;
    handlers.setState(value);
    setPrev(value);
    // eslint-disable-next-line
  }, [value]);

  // useEffect(() => {
  //   // console.log("items append")
  //   if (
  //     active &&
  //     (items.length === 0 || (items.length && !!items[items.length - 1]))
  //   ) {
  //     handlers.append(null)
  //   }
  //   // console.log(
  //   //   items.some((item) => !item),
  //   //   items
  //   // )
  //   if (!active && items.some((item) => !item)) {
  //     handlers.filter((val) => !!val)
  //     console.log("items filter")
  //   }
  //   // console.log("items active")
  // }, [items, active])

  return (
    <div
      className="flex-grow"
      // onClick={() => !disabled && setFocus(true)}
      // onFocus={() => !disabled && setFocus(true)}
      // onBlur={handleBlurForInnerElements(() => setFocus(false))}
      // tabIndex={999999}
    >
      <InputLabel label={label} />

      <div className="flex min-h-[2.75rem] flex-col gap-2">
        <div className=" flex flex-col gap-2">
          {/* {items.length == 0 && "⸺"} */}
          {items.map((val, index) => {
            return (
              <RadixContextMenu.Root key={uuid + index}>
                <RadixContextMenu.Trigger className="flex-grow rounded-sm bg-stone-200 dark:bg-stone-800">
                  <Element
                    {...omit(elementProps, ["label"])}
                    value={val}
                    onSubmit={(itemValue: any) => {
                      handlers.setItem(index, itemValue);
                    }}
                    disabled={disabled}
                    linkEntry={linkEntry}
                  />
                </RadixContextMenu.Trigger>
                <RadixContextMenu.Portal>
                  <RadixContextMenu.Content className="flex min-w-[220px] flex-col gap-2 overflow-hidden rounded-md bg-white p-[5px] dark:bg-stone-950">
                    <RadixContextMenu.Item
                      className="button flex-grow justify-start bg-stone-800 hover:bg-stone-600"
                      onClick={() => {
                        handlers.remove(index);
                      }}
                    >
                      <IconTrashX /> Delete
                    </RadixContextMenu.Item>
                  </RadixContextMenu.Content>
                </RadixContextMenu.Portal>
              </RadixContextMenu.Root>
            );
          })}
        </div>

        {!disabled && (
          <Button
            variant="outline"
            className=""
            onClick={
              () => handlers.append(null)
              //  setItems((val) => [...val, null])
            }
            disabled={maxCount ? maxCount <= items.length : undefined}
            // style={{ flexGrow: 1 }}
          >
            <IconPlus />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditableArray;
