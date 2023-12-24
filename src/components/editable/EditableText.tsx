import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  forwardRef,
  useImperativeHandle,
} from "react";
import DisplayCellExpanding from "@/components/ui/DisplayCellExpanding";
import preventLeave from "@/utils/preventLeave";
import { Label } from "@/components/ui/Label";
import type EditableInput from "@/schema/EditableInput";
import inputFocusAtEndOfLine from "@/utils/inputFocusAtEndOfLine";
import { useClickOutside } from "@mantine/hooks";
import { useEditableContext } from "./Editable";
import { cn } from "@/utils/cn";

interface EditableTextProps extends EditableInput<string> {
  maxLength?: number;
  style?: CSSProperties;
}

const EditableText = (props: EditableTextProps) => {
  const {
    data,
    keyName,
    value,
    disabled,
    onSubmit,
    className,
    label,
    leftSection,
    maxLength,
    required,
    rightSection,
    style,
    ...moreProps
  } = useEditableContext(props);
  const uuid = useId();
  const [text, setText] = useState<string>(value ?? "");
  const [focus, setFocus] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const outerRef = useClickOutside(() => setFocus(false));
  const onFocus = () => !disabled && setFocus(true);

  const onSubmitValue = (text: string) => {
    // if text empty submit undefined
    if (text.length === 0 && value !== undefined) {
      onSubmit?.(undefined);
    } else if (text !== (value ?? "")) {
      onSubmit?.(text);
    }
  };
  useEffect(() => {
    if (focus) {
      inputFocusAtEndOfLine(textAreaRef);
      window.addEventListener("beforeunload", preventLeave);
    } else {
      onSubmitValue(text);
      window.removeEventListener("beforeunload", preventLeave);
    }
    // eslint-disable-next-line
  }, [focus]);

  useEffect(() => {
    return () => {
      console.log(text);
      onSubmitValue(text);
      window.removeEventListener("beforeunload", preventLeave);
    };
    // eslint-disable-next-line
  }, []);
  console.log(text);
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
      if (e.code === "Tab") {
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
      onClick={onFocus}
      onFocus={onFocus}
      ref={outerRef}
    >
      <Label label={label} copyValue={text} htmlFor={"textarea_" + uuid} />
      <DisplayCellExpanding
        leftSection={leftSection}
        rightSection={rightSection}
        focus={focus}
        className={className}
      >
        <textarea
          id={"textarea_" + uuid}
          name={"textarea_" + uuid}
          required={required}
          readOnly={disabled}
          ref={textAreaRef}
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
              placeholder:text-gray-400
              focus-visible:border-transparent
              focus-visible:outline-none
              dark:placeholder:text-stone-600
              `,
            className,
          )}
          style={style}
          value={text}
          onFocus={onFocus}
          onClick={onFocus}
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
