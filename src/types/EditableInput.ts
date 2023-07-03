import { type ReactNode } from "react";

interface EditableInput<T> {
  label?: string;
  value?: T;
  initialValue?: T;
  onSubmit?: (value: T | null) => void | boolean;
  disabled?: boolean;
  required?: boolean;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  className?: string;
}

export default EditableInput;
