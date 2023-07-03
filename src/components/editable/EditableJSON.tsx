import { useId } from "react";

import { useClipboard } from "@mantine/hooks";
import { IconCopy } from "@tabler/icons-react";

import { useToast } from "@/hooks/useToast";

import type EditableInput from "@/types/EditableInput";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EditableJSONProps extends EditableInput<string> {}

const EditableJSON = ({ value, label }: EditableJSONProps) => {
  const { toast } = useToast();
  const uuid = useId();
  const clipboard = useClipboard();
  return (
    <div className="flex-grow">
      {label && (
        <label
          htmlFor={"textarea_" + uuid}
          className="
          text-sm
          dark:text-stone-300"
        >
          <div className="flex items-center py-1">
            {label}{" "}
            {!!value && (
              <button
                className="border-1 inline-flex animate-pop items-center justify-center
            gap-3 rounded-md  stroke-gray-200 p-1 font-semibold uppercase
          text-gray-200 no-underline transition-all  
          hover:bg-black hover:bg-opacity-30
            active:hover:scale-95 active:hover:animate-none 
            active:focus:scale-95 active:focus:animate-none"
                onClick={() => {
                  const valueAsJson = JSON.stringify(value, null, 2);
                  clipboard.copy(valueAsJson);
                  toast({
                    title: "Skopiowano do schowka",
                    description: valueAsJson,
                  });
                }}
                tabIndex={-1}
              >
                <IconCopy size={16} />
              </button>
            )}
          </div>
        </label>
      )}

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
