import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  useLayoutEffect,
} from "react";

import preventLeave from "@/utils/preventLeave";

import DisplayCell from "@/components/ui/DisplayCell";
import { Label } from "@/components/ui/Label";
import type EditableInput from "@/types/EditableInput";
import inputFocusAtEndOfLine from "@/utils/inputFocusAtEndOfLine";
import { useClickOutside } from "@mantine/hooks";
import { useEditableContext } from "./Editable";
import { cn } from "@/utils/cn";

interface EditableShortTextProps extends EditableInput<string> {
  maxLength?: number;
  style?: CSSProperties;
}

const EditableShortText = (props: EditableShortTextProps) => {
  const {
    label,
    value,
    onSubmit,
    disabled,
    required,
    maxLength,
    style,
    className,
    leftSection,
    rightSection,

    keyName,
    ...moreProps
  } = useEditableContext(props);
  const uuid = useId();
  const [text, setText] = useState<string>(value ?? "");
  const [focus, setFocus] = useState<boolean>(false);
  const InputRef = useRef<HTMLInputElement>(null);
  const outerRef = useClickOutside(() => setFocus(false));
  const onFocus = () => !disabled && setFocus(true);

  // const t = useTranslation();
  useEffect(() => {
    if (focus) {
      inputFocusAtEndOfLine(InputRef);
      window.addEventListener("beforeunload", preventLeave);
    } else {
      if (text !== (value ?? "")) {
        onSubmit?.(text);
      }
      window.removeEventListener("beforeunload", preventLeave);
    }
  }, [focus]);

  useLayoutEffect(() => {
    return () => {
      if (text !== (value ?? "")) {
        onSubmit?.(text);
      }
      window.removeEventListener("beforeunload", preventLeave);
    };
  }, []);

  useEffect(() => {
    const new_value = value ?? "";
    setText(new_value);
  }, [value]);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!(maxLength && e.target.value.length > maxLength)) {
      setText(e.target.value);
    }
  };

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (focus) {
      if (e.code === "Enter" && !e.shiftKey) {
        e.preventDefault();
        (e.target as HTMLInputElement).blur();
        setFocus(false);
      }
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: This is intended to be focused with keyboard or mouse, no onPress needed
    <div
      className="flex-grow"
      onClick={onFocus}
      onFocus={onFocus}
      ref={outerRef}
    >
      <Label label={label} copyValue={text} htmlFor={`short_text_${uuid}`} />
      <DisplayCell
        leftSection={leftSection}
        rightSection={rightSection}
        focus={focus}
        disabled={disabled}
        className={className}
      >
        <input
          id={`short_text_${uuid}`}
          name={`short_text_${uuid}`}
          required={required}
          readOnly={disabled}
          ref={InputRef}
          className={cn(
            "w-full resize-none overflow-hidden whitespace-pre-line break-words bg-transparent py-3 text-sm outline-none focus-visible:border-transparent dark:data-disabled:text-gray-500 data-disabled:text-gray-500 focus-visible:outline-none",
            className,
          )}
          style={style}
          value={text}
          onFocus={onFocus}
          onClick={onFocus}
          onChange={onChangeInput}
          onKeyDown={onKeyDownInput}
          maxLength={maxLength}
          {...moreProps}
        />
      </DisplayCell>
    </div>
  );
};

export default EditableShortText;
