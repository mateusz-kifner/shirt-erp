import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

import InputLabel from "@/components/input/InputLabel";
import DisplayCellExpanding from "@/components/ui/DisplayCellExpanding";
import { handleBlurForInnerElements } from "@/utils/handleBlurForInnerElements";
import preventLeave from "@/utils/preventLeave";

import type EditableInput from "@/types/EditableInput";

interface EditableTextProps extends EditableInput<string> {
  maxLength?: number;
  style?: CSSProperties;
}

const EditableText = (props: EditableTextProps) => {
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
    ...moreProps
  } = props;
  const uuid = useId();
  const [text, setText] = useState<string>(value ?? "");
  const [focus, setFocus] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // const t = useTranslation();
  useEffect(() => {
    if (focus) {
      window.addEventListener("beforeunload", preventLeave);
      textAreaRef.current &&
        (textAreaRef.current.selectionStart = textAreaRef.current.value.length);
      textAreaRef.current && textAreaRef.current.focus();
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

  // Set initial text area height
  useEffect(() => {
    if (textAreaRef.current !== null) {
      setTextAreaHeight(textAreaRef.current);
    }
  }, [textAreaRef]);

  const onChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!(maxLength && e.target.value.length > maxLength)) {
      setText(e.target.value);
    }
  };

  const onKeyDownTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (focus) {
      if (e.code === "Enter" && !e.shiftKey) {
        e.preventDefault();
        (e.target as HTMLTextAreaElement).blur();
        setFocus(false);
      }
    }
  };

  const setTextAreaHeight = (target: HTMLTextAreaElement) => {
    target.style.height = "0";
    target.style.height = `${Math.max(target.scrollHeight, 44)}px`;
  };

  return (
    <div
      className="flex-grow"
      onClick={() => !disabled && setFocus(true)}
      onFocus={() => !disabled && setFocus(true)}
      onBlur={handleBlurForInnerElements(() => setFocus(false))}
    >
      <InputLabel label={label} copyValue={text} htmlFor={"textarea_" + uuid} />
      <DisplayCellExpanding
        leftSection={leftSection}
        rightSection={rightSection}
        focus={focus}
      >
        <textarea
          id={"textarea_" + uuid}
          name={"textarea_" + uuid}
          required={required}
          readOnly={disabled}
          ref={textAreaRef}
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
          placeholder:text-gray-400
          focus-visible:border-transparent
          focus-visible:outline-none
          dark:placeholder:text-stone-600
          ${className ?? ""}`}
          style={style}
          value={text}
          onFocus={() => !disabled && setFocus(true)}
          onClick={() => !disabled && setFocus(true)}
          onChange={onChangeTextarea}
          onKeyDown={onKeyDownTextarea}
          onInput={(e) => setTextAreaHeight(e.target as HTMLTextAreaElement)}
          maxLength={maxLength}
          placeholder={focus ? undefined : "⸺"}
          {...moreProps}
        />
      </DisplayCellExpanding>
    </div>
  );
};

export default EditableText;
