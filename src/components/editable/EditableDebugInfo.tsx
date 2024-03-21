/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CSSProperties } from "react";

import { useUserContext } from "@/context/userContext";
import type EditableInput from "@/types/EditableInput";
import { useEditableContext } from "./Editable";

interface EditableDebugInfoProps extends EditableInput<string> {
  maxLength?: number;
  style?: CSSProperties;
}

const EditableDebugInfo = (props: EditableDebugInfoProps) => {
  const {
    label,
    value,
    onSubmit,
    disabled,
    required,
    maxLength,
    className,
    leftSection,
    rightSection,
    keyName,
    ...moreProps
  } = useEditableContext(props);
  const { debug } = useUserContext();

  return debug ? (
    <div {...moreProps}>
      <span className="pr-2 text-yellow-800 dark:text-yellow-400">{label}</span>
      {value}
    </div>
  ) : null;
};

export default EditableDebugInfo;
