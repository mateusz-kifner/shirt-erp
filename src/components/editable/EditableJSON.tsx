import type EditableInput from "@/schema/EditableInput";
import { useEditableContext } from "./Editable";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
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
