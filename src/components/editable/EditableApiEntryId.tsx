import { type CSSProperties } from "react";

import EditableApiEntry from "@/components/editable/EditableApiEntry";
import { api } from "@/utils/api";

import type EditableInput from "@/schema/EditableInput";

interface EditableApiEntryIdProps extends EditableInput<number> {
  entryName: string;
  Element: React.ElementType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  copyProvider?: (value: any) => string | undefined;
  style?: CSSProperties;
  withErase?: boolean;
}

const EditableApiEntryId = (props: EditableApiEntryIdProps) => {
  const { value, onSubmit, entryName } = props;
  const { data } = api[entryName as "client"].getById.useQuery(
    value as number,
    { enabled: !!value },
  );
  return (
    <EditableApiEntry
      {...props}
      onSubmit={(value) => value?.id !== undefined && onSubmit?.(value.id)}
      // @ts-ignore
      value={value ? data : null}
    />
  );
};

export default EditableApiEntryId;
