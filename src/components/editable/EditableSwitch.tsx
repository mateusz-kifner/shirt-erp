import { useEffect, useState } from "react";

import { Switch } from "@/components/ui/Switch";
import { useHover } from "@mantine/hooks";

import type EditableInput from "@/types/EditableInput";
import { useEditableContext } from "./Editable";
import { type VariantProps, cva } from "class-variance-authority";

// FIXME: respect disabled state
// TODO: center text on button and add color variant

// EditableInput<T> {
//   label?: string;
//   value?: T;
//   onSubmit?: (value: T | null) => void | boolean;
//   disabled?: boolean;
//   required?: boolean;
//   leftSection?: ReactNode;
//   rightSection?: ReactNode;
//   className?: string;
// }

interface EditableSwitchProps
  extends EditableInput<boolean>,
    VariantProps<typeof editableSwitchVariants> {
  stateLabels?: { checked: string; unchecked: string };
  stateColors?: { checked: string; unchecked: string };
}

const editableSwitchVariants = cva(
  "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        color:
          "data-[state=checked]:border-green-800 data-[state=checked]:dark:border-green-500 data-[state=unchecked]:border-red-800 data-[state=unchecked]:dark:border-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const EditableSwitch = (props: EditableSwitchProps) => {
  const {
    label,
    value,
    onSubmit,
    disabled,
    // required,
    stateLabels = { checked: "Tak", unchecked: "Nie" },
    // stateColors = { checked: "#2f9e44", unchecked: "#e03131" },
    rightSection,
    leftSection,
    variant,
    // keyName,
  } = useEditableContext(props);

  // const switchRef = useRef(null);
  const [bool, setBool] = useState<boolean>(value ?? false);
  const [dirty, setDirty] = useState<boolean>(false);
  const { hovered, ref } = useHover();

  const active = hovered && !disabled;

  useEffect(() => {
    value !== undefined && setBool(value);
  }, [value]);

  useEffect(() => {
    if (dirty) {
      onSubmit?.(bool);
    }
    // eslint-disable-next-line
  }, [bool]);

  const handleChange = (checked: boolean) => {
    setDirty(true);
    onSubmit?.(checked);
  };

  return (
    <div className="mb-1 flex min-h-[2rem] items-center gap-2" ref={ref}>
      {!!leftSection && leftSection}
      <div>{label}</div>
      {active ? (
        <Switch
          checked={value}
          onCheckedChange={handleChange}
          variant={variant}
        />
      ) : (
        <div
          className={editableSwitchVariants({
            variant,
          })}
          data-state={value ?? false ? "checked" : "unchecked"}
        >
          {bool ? stateLabels.checked : stateLabels.unchecked}
        </div>
        //   <div
        //   className={`px relative rounded-md font-bold after:absolute after:bottom-0.5 after:left-0 after:h-px after:w-full after:shadow ${
        //     bool ? "after:shadow-green-700" : "after:shadow-red-700"
        //   }`}
        // >
        //   {bool ? stateLabels.checked : stateLabels.unchecked}
        // </div>
      )}
      {!!rightSection && rightSection}
    </div>
  );
};

export default EditableSwitch;
