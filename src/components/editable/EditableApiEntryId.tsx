import { type CSSProperties } from "react";

import EditableApiEntry from "@/components/editable/EditableApiEntry";
import { api } from "@/utils/api";

import type EditableInput from "@/schema/EditableInput";
import { useEditableContext } from "./Editable";

// Simplify this / make it standalone component

interface EditableApiEntryIdProps extends EditableInput<number> {
  entryName: string;
  Element: React.ElementType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  copyProvider?: (value: any) => string | undefined;
  style?: CSSProperties;
  withErase?: boolean;
}

const EditableApiEntryId = (props: EditableApiEntryIdProps) => {
  const { value, onSubmit, entryName, keyName, ...moreProps } =
    useEditableContext(props);
  if (keyName === undefined)
    throw new Error("[EditableApiEntryId]: keyName not defined");
  const { data } = api[entryName as "client"].getById.useQuery(
    value as number,
    { enabled: !!value },
  );
  return (
    <EditableApiEntry
      {...moreProps}
      onSubmit={(key, value) => value?.id !== undefined && onSubmit?.(value.id)}
      value={value !== undefined ? data : undefined}
      data={
        value !== undefined ? { [keyName]: { ...data, id: value } } : undefined // transform data to format that is compatible with value of EditableApiEntry
      }
      entryName={entryName}
      keyName={keyName}
    />
  );
};

export default EditableApiEntryId;
