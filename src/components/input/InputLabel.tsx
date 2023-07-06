import { type LabelHTMLAttributes, type ReactNode } from "react";

import { useClipboard } from "@mantine/hooks";
import { IconCopy, IconQuestionMark } from "@tabler/icons-react";

import { useToast } from "@/hooks/useToast";
import ActionButton from "../ui/ActionButton";
import SimpleTooltip from "../ui/SimpleTooltip";

//  LabelHTMLAttributes {
//   form?: string | undefined;
//   htmlFor?: string | undefined;
// }

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label?: ReactNode;
  copyValue?: string;
  required?: boolean;
  helpTooltip?: string;
}

function InputLabel(props: InputLabelProps) {
  const { label, copyValue, required, helpTooltip, ...moreProps } = props;
  const { toast } = useToast();
  const clipboard = useClipboard();
  return label ? (
    <label
      className="
        text-sm
        dark:text-stone-300
        
        "
      {...moreProps}
    >
      <div className="flex h-8 items-center py-1">
        {label}
        {required && <span className="text-red-600">*</span>}
        {copyValue && copyValue.length > 0 && (
          <ActionButton
            className="ml-1 h-5 w-5"
            onClick={() => {
              clipboard.copy(copyValue);
              toast({
                title: "Skopiowano do schowka",
                description: copyValue,
              });
            }}
            tabIndex={-1}
          >
            <IconCopy size={16} />
          </ActionButton>
        )}
        {helpTooltip && helpTooltip.length > 0 && (
          <SimpleTooltip
            tooltip={helpTooltip}
            className="px-1"
            classNameTooltip="w-80 whitespace-normal dark:whitespace-normal"
            delay="delay-700"
          >
            <IconQuestionMark size={16} />
          </SimpleTooltip>
        )}
      </div>
    </label>
  ) : null;
}

export default InputLabel;
