import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

import preventLeave from "@/utils/preventLeave";

import type EditableInput from "@/schema/EditableInput";
import { useClickOutside } from "@mantine/hooks";
import DisplayCell from "../ui/DisplayCell";
import { Label } from "../ui/Label";

interface EditableNumberProps extends EditableInput<number> {
  maxLength?: number;
  style?: CSSProperties;
  increment?: number;
  fixed?: number;
  min?: number;
  max?: number;
}

const EditableNumber = (props: EditableNumberProps) => {
  const {
    label,
    value,
    onSubmit,
    disabled,
    required,
    maxLength = Number.MAX_SAFE_INTEGER,
    style,
    className,
    leftSection,
    rightSection,
    increment = 0.01,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
    fixed = 2,
    ...moreProps
  } = props;
  const uuid = useId();
  const [text, setText] = useState<string>(
    !(value === undefined || isNaN(value)) ? value.toFixed(fixed) : ""
  );
  const [focus, setFocus] = useState<boolean>(false);
  const InputRef = useRef<HTMLInputElement>(null);
  const outerRef = useClickOutside(() => setFocus(false));

  // const t = useTranslation();
  useEffect(() => {
    if (focus) {
      window.addEventListener("beforeunload", preventLeave);
      InputRef.current?.focus();
      InputRef.current?.selectionStart &&
        (InputRef.current.selectionStart = InputRef.current.value.length);
    } else {
      if (parseFloat(text) !== value) {
        onSubmit?.(parseFloat(text));
      }
      window.removeEventListener("beforeunload", preventLeave);
    }
    // eslint-disable-next-line
  }, [focus]);

  useEffect(() => {
    return () => {
      if (parseFloat(text) !== value) {
        onSubmit?.(parseFloat(text));
      }
      window.removeEventListener("beforeunload", preventLeave);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (parseFloat(text) !== value) {
      const new_value = !(value === undefined || isNaN(value))
        ? value.toFixed(fixed)
        : "";
      setText(new_value);
    }
  }, [value]);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < maxLength) {
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
      if (e.code === "ArrowUp") {
        const multiplier = e.ctrlKey ? 100 : e.shiftKey ? 10 : 1;
        setText((val) =>
          (parseFloat(val) + increment * multiplier).toFixed(fixed)
        );
      }
      if (e.code === "ArrowDown") {
        const multiplier = e.ctrlKey ? 100 : e.shiftKey ? 10 : 1;
        setText((val) =>
          (parseFloat(val) - increment * multiplier).toFixed(fixed)
        );
      }
    }
  };

  const onFocus = () => !disabled && setFocus(true);

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

export default EditableNumber;
