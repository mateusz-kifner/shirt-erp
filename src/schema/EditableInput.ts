import { type ReactNode } from "react";

interface EditableInput<T> {
  label?: string;
  value?: T;
  onSubmit?: (value: T | null) => void | boolean;
  disabled?: boolean;
  required?: boolean;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  className?: string;
  keyName?: string;
}

export default EditableInput;
