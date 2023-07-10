import InputLabel from "@/components/input/InputLabel";

import useTranslation from "@/hooks/useTranslation";
import type EditableInput from "@/types/EditableInput";
import { type SelectProps as RadixSelectProps } from "@radix-ui/react-select";
import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";

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

//  RadixSelectProps {
//   children?: React.ReactNode;
//   value?: string;
//   defaultValue?: string;
//   onValueChange?(value: string): void;
//   open?: boolean;
//   defaultOpen?: boolean;
//   onOpenChange?(open: boolean): void;
//   dir?: Direction;
//   name?: string;
//   autoComplete?: string;
//   disabled?: boolean;
//   required?: boolean;
// }

interface EditableEnumProps extends EditableInput<string>, RadixSelectProps {
  enum_data: string[];
  collapse?: boolean;
}

const EditableEnum = ({
  enum_data,
  label,
  value,
  onSubmit,
  disabled,
  required,
  collapse = false,
  ...moreProps
}: EditableEnumProps) => {
  const t = useTranslation();
  const uuid = useId();

  return (
    <div className={`flex flex-grow  ${collapse ? "gap-3 pt-3" : "flex-col"}`}>
      <InputLabel
        label={label}
        copyValue={t[value as keyof typeof t] as string}
        required={required}
      />
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select ..." />
        </SelectTrigger>
        <SelectContent>
          {enum_data.map((val, index) => (
            <SelectItem value={val} key={`${uuid}_${index}`}>
              {(t[val as keyof typeof t] as string | undefined) ?? val}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* <Select
        data={enum_data}
        value={value}
        onValueChange={(value) => {
          onSubmit?.(value);
          console.log(value);
        }}
        disabled={disabled}
        {...moreProps}
      /> */}
    </div>
  );
};

export default EditableEnum;
