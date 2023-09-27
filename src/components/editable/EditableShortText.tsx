import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

import preventLeave from "@/utils/preventLeave";

import DisplayCell from "@/components/ui/DisplayCell";
import { Label } from "@/components/ui/Label";
import type EditableInput from "@/schema/EditableInput";
import inputFocusAtEndOfLine from "@/utils/inputFocusAtEndOfLine";
import { useClickOutside } from "@mantine/hooks";

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    keyName,
    ...moreProps
  } = props;
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
    // eslint-disable-next-line
  }, [focus]);

  useEffect(() => {
    return () => {
      if (text !== (value ?? "")) {
        onSubmit?.(text);
      }
      window.removeEventListener("beforeunload", preventLeave);
    };
    // eslint-disable-next-line
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
    <div
      className="flex-grow"
      onClick={onFocus}
      onFocus={onFocus}
      ref={outerRef}
    >
      <Label label={label} copyValue={text} htmlFor={"short_text_" + uuid} />
      <DisplayCell
        leftSection={leftSection}
        rightSection={rightSection}
        focus={focus}
        disabled={disabled}
        className={className}
      >
        <input
          id={"short_text_" + uuid}
          name={"short_text_" + uuid}
          required={required}
          readOnly={disabled}
          ref={InputRef}
          className={`
          data-disabled:text-gray-500
          dark:data-disabled:text-gray-500
          w-full
          resize-none
          overflow-hidden
          whitespace-pre-line 
          break-words
          bg-transparent
          py-3
          text-sm
          outline-none
          focus-visible:border-transparent
          focus-visible:outline-none
          ${className ?? ""}`}
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
