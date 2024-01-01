import { useClickOutside } from "@mantine/hooks";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

import DisplayCell from "@/components/ui/DisplayCell";
import { Label } from "@/components/ui/Label";
import { useLoaded } from "@/hooks/useLoaded";
import type EditableInput from "@/schema/EditableInput";
import inputFocusAtEndOfLine from "@/utils/inputFocusAtEndOfLine";
import preventLeave from "@/utils/preventLeave";
import { useEditableContext } from "./Editable";
import { cn } from "@/utils/cn";

const isNumRegex = /^[\d|\+|\.|\,]+$/;

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    keyName,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data,
    ...moreProps
  } = useEditableContext(props);
  const uuid = useId();
  const toText = (num?: number | null) => {
    if (num === null) return "";
    if (num === undefined) return "";
    if (isNaN(num)) return "";
    return Number(num).toFixed(fixed); // no idea why this conversion is nesesery TODO: investigate missing toFixed on 'number'
  };
  const [text, setText] = useState<string>(toText(value));
  const isLoaded = useLoaded();
  const [focus, setFocus] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const InputRef = useRef<HTMLInputElement>(null);
  const outerRef = useClickOutside(() => setFocus(false));
  const onFocus = () => !disabled && setFocus(true);

  const onSubmitValue = (text: string) => {
    if (!isLoaded) return;
    const num = parseFloat(text);
    if (isNaN(num)) {
      if (!isNaN(value ?? NaN)) {
        onSubmit?.(undefined);
      }
    } else if (num !== value) {
      onSubmit?.(num);
    }
  };

  useEffect(() => {
    if (focus) {
      inputFocusAtEndOfLine(InputRef);
      window.addEventListener("beforeunload", preventLeave);
    } else {
      onSubmitValue(text);
      window.removeEventListener("beforeunload", preventLeave);
    }
    // eslint-disable-next-line
  }, [focus]);

  useEffect(() => {
    return () => {
      onSubmitValue(text);
      window.removeEventListener("beforeunload", preventLeave);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (parseFloat(text) !== value) {
      const new_value = toText(value);
      setText(new_value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < maxLength) {
      setText(e.target.value.replace(",", "."));
      setError(!isNumRegex.test(e.target.value));
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
          (parseFloat(val) + increment * multiplier).toFixed(fixed),
        );
      }
      if (e.code === "ArrowDown") {
        const multiplier = e.ctrlKey ? 100 : e.shiftKey ? 10 : 1;
        setText((val) =>
          (parseFloat(val) - increment * multiplier).toFixed(fixed),
        );
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
        error={error}
        disabled={disabled}
      >
        <input
          id={"short_text_" + uuid}
          name={"short_text_" + uuid}
          required={required}
          readOnly={disabled}
          ref={InputRef}
          className={cn(
            `
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
          focus-visible:outline-none`,
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

export default EditableNumber;
