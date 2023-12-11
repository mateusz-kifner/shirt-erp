// import type EditableInput from "@/schema/EditableInput";
// import { cn } from "@/utils/cn";
// import { useListState } from "@mantine/hooks";
// import { IconPlus, IconTrashX } from "@tabler/icons-react";
// import { isEqual } from "lodash";
// import {
//   type ReactElement,
//   cloneElement,
//   useEffect,
//   useId,
//   useState,
// } from "react";
// import Button, { buttonVariants } from "../ui/Button";
// import {
//   ContextMenu,
//   ContextMenuContent,
//   ContextMenuItem,
//   ContextMenuTrigger,
// } from "../ui/ContextMenu";
// import { Label } from "../ui/Label";

// interface EditableArrayProps<T> extends EditableInput<T[]> {
//   maxCount?: number;
//   uniqueItems?: boolean;
//   children: ReactElement<EditableInput<T>>;
// }

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function EditableArray<T = any>(props: EditableArrayProps<T>) {
//   const {
//     label,
//     value,
//     onSubmit,
//     disabled,
//     // required,
//     maxCount,
//     // uniqueItems,
//     children,
//     // keyName,
//   } = props;

//   const [items, handlers] = useListState<T | null>(value ?? []);
//   // const [focus, setFocus] = useState<boolean>(false);
//   const [prev, setPrev] = useState<(T | null)[]>(items);
//   const uuid = useId();

//   useEffect(() => {
//     const filtered_items = items.filter((val) => val !== null) as T[];
//     if (
//       isEqual(
//         filtered_items,
//         prev.filter((val) => !!val),
//       )
//     )
//       return;
//     onSubmit?.(filtered_items);
//     // eslint-disable-next-line
//   }, [items]);

//   useEffect(() => {
//     if (value === undefined || value === null) return;
//     handlers.setState(value);
//     setPrev(value);
//     // eslint-disable-next-line
//   }, [value]);

//   // useEffect(() => {
//   //   // console.log("items append")
//   //   if (
//   //     active &&
//   //     (items.length === 0 || (items.length && !!items[items.length - 1]))
//   //   ) {
//   //     handlers.append(null)
//   //   }
//   //   // console.log(
//   //   //   items.some((item) => !item),
//   //   //   items
//   //   // )
//   //   if (!active && items.some((item) => !item)) {
//   //     handlers.filter((val) => !!val)
//   //     console.log("items filter")
//   //   }
//   //   // console.log("items active")
//   // }, [items, active])

//   return (
//     <div
//       className="flex-grow"
//       // onClick={() => !disabled && setFocus(true)}
//       // onFocus={() => !disabled && setFocus(true)}
//       // onBlur={handleBlurForInnerElements(() => setFocus(false))}
//       // tabIndex={999999}
//     >
//       <Label label={label} />

//       <div className="flex min-h-[2.75rem] flex-col gap-2">
//         <div className=" flex flex-col gap-2">
//           {items.length == 0 && "⸺"}
//           {items.map((val, index) => {
//             // const elementPropsMerge = {
//             //   ...omit(elementProps, ["label", "arrayType"]),
//             //   value: val,
//             //   onSubmit: (itemValue: any) => {
//             //     handlers.setItem(index, itemValue);
//             //   },
//             // };
//             // if (disabled) elementProps.disabled = true;
//             // if (linkEntry) elementProps.linkEntry = true;

//             return (
//               <ContextMenu key={uuid + index}>
//                 <ContextMenuTrigger asChild>
//                   {cloneElement(children, {
//                     value: val ?? undefined,
//                     onSubmit: (itemValue: T | null) => {
//                       handlers.setItem(index, itemValue);
//                     },
//                     disabled,
//                   })}
//                 </ContextMenuTrigger>
//                 <ContextMenuContent>
//                   <ContextMenuItem
//                     className={cn(
//                       buttonVariants({ variant: "ghost" }),
//                       "justify-start",
//                     )}
//                     onClick={() => {
//                       handlers.remove(index);
//                     }}
//                   >
//                     <IconTrashX /> Delete
//                   </ContextMenuItem>
//                 </ContextMenuContent>
//               </ContextMenu>
//             );
//           })}
//         </div>

//         {!disabled && (
//           <Button
//             variant="outline"
//             className=""
//             onClick={
//               () => handlers.append(null)
//               //  setItems((val) => [...val, null])
//             }
//             disabled={maxCount ? maxCount <= items.length : undefined}
//             // style={{ flexGrow: 1 }}
//           >
//             <IconPlus />
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default EditableArray;

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
