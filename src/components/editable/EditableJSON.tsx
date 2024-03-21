import type EditableInput from "@/types/EditableInput";
import { useEditableContext } from "./Editable";

interface EditableJSONProps extends EditableInput<string> {}

const EditableJSON = (props: EditableJSONProps) => {
  const { value } = useEditableContext(props);
  return (
    <div className="flex-grow">
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
