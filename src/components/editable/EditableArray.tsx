import { useEffect, useId, useState, type ComponentType } from "react";

import { useListState } from "@mantine/hooks";
import { IconPlus, IconTrashX } from "@tabler/icons-react";
import { isEqual, omit } from "lodash";

import Button from "@/components/ui/Button";

import { Label } from "@/components/ui/Label";
import type EditableInput from "@/schema/EditableInput";
import * as RadixContextMenu from "@radix-ui/react-context-menu";

// fixme submit only on edit end

interface EditableArrayProps extends Omit<EditableInput<any[]>, "value"> {
  value?: any[] | null;
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
    newItemValue,
    onSubmit,
    disabled,
    required,
    maxCount,
    Element,
    elementProps,
    organizingHandle = "none",
    linkEntry,
    unique = true,
  } = props;
  const [items, handlers] = useListState<any>(value ?? []);
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
      <Label label={label} />

      <div className="flex min-h-[2.75rem] flex-col gap-2">
        <div className=" flex flex-col gap-2">
          {/* {items.length == 0 && "⸺"} */}
          {items.map((val, index) => {
            const elementPropsMerge = {
              ...omit(elementProps, ["label", "arrayType"]),
              value: val,
              onSubmit: (itemValue: any) => {
                handlers.setItem(index, itemValue);
              },
            };
            if (disabled) elementProps.disabled = true;
            if (linkEntry) elementProps.linkEntry = true;

            return (
              <RadixContextMenu.Root key={uuid + index}>
                <RadixContextMenu.Trigger className="flex-grow rounded-sm bg-stone-200 dark:bg-stone-800">
                  <Element {...elementPropsMerge} />
                </RadixContextMenu.Trigger>
                <RadixContextMenu.Portal>
                  <RadixContextMenu.Content className=" z-[9999] flex min-w-[220px] flex-col gap-2 overflow-hidden rounded-md bg-white p-[5px] dark:bg-stone-950">
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
