import { useEffect, useState } from "react";

import { Switch } from "@/components/ui/Switch";
import { useHover } from "@mantine/hooks";

import type EditableInput from "@/schema/EditableInput";
import { useEditableContext } from "./Editable";

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

interface EditableSwitchProps extends EditableInput<boolean> {
  stateLabels?: { checked: string; unchecked: string };
  stateColors?: { checked: string; unchecked: string };
}

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
        <Switch checked={value} onCheckedChange={handleChange} />
      ) : (
        <div
          className={`px relative rounded-md font-bold after:absolute after:bottom-0.5 after:left-0 after:h-px after:w-full after:shadow ${
            bool ? "after:shadow-green-700" : "after:shadow-red-700"
          }`}
        >
          {bool ? stateLabels.checked : stateLabels.unchecked}
        </div>
      )}
      {!!rightSection && rightSection}
    </div>
  );
};

export default EditableSwitch;
