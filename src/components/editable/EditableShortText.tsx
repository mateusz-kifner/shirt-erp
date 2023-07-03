import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

import InputLabel from "@/components/input/InputLabel";
import { handleBlurForInnerElements } from "@/utils/handleBlurForInnerElements";
import preventLeave from "@/utils/preventLeave";

import type EditableInput from "@/types/EditableInput";
import DisplayCell from "../ui/DisplayCell";

interface EditableShortTextProps extends EditableInput<string> {
  maxLength?: number;
  style?: CSSProperties;
}

const EditableShortText = (props: EditableShortTextProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    maxLength,
    style,
    className,
    leftSection,
    rightSection,
    ...moreProps
  } = props;
  const uuid = useId();
  const [text, setText] = useState<string>(value ?? initialValue ?? "");
  const [focus, setFocus] = useState<boolean>(false);
  const InputRef = useRef<HTMLInputElement>(null);

  // const t = useTranslation();
  useEffect(() => {
    if (focus) {
      window.addEventListener("beforeunload", preventLeave);
      InputRef.current?.focus();
      InputRef.current?.selectionStart &&
        (InputRef.current.selectionStart = InputRef.current.value.length);
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
      onClick={() => !disabled && setFocus(true)}
      onFocus={() => !disabled && setFocus(true)}
      onBlur={handleBlurForInnerElements(() => setFocus(false))}
    >
      <InputLabel
        label={label}
        copyValue={text}
        htmlFor={"short_text_" + uuid}
      />
      <DisplayCell
        leftSection={leftSection}
        rightSection={rightSection}
        focus={focus}
      >
        <input
          id={"short_text_" + uuid}
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
          onFocus={() => !disabled && setFocus(true)}
          onClick={() => !disabled && setFocus(true)}
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
