import { useId } from "react";

import { Input } from "@/components/ui/Input";
import type EditableInput from "@/schema/EditableInput";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EditableJSONProps extends EditableInput<string> {}

const EditableJSON = ({ value, label, keyName }: EditableJSONProps) => {
  const uuid = useId();
  return (
    <div className="flex-grow">
      <Input />
      <code
        style={{
          overflow: "hidden",
          maxWidth: "100%",
          padding: "0",
          boxSizing: "border-box",
          whiteSpace: "pre",
        }}
      >
        {JSON.stringify(value, null, 2)}
      </code>
    </div>
  );
};

export default EditableJSON;
