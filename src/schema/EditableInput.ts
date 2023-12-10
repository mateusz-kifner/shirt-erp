import { type ReactNode } from "react";

interface EditableInput<T> {
  label?: string;
  value?: T;
  disabled?: boolean;
  required?: boolean;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  className?: string;
  keyName?: string | number;
  data?: T;
  onSubmit?: (key: string | number, value: T) => void;
}

export default EditableInput;
