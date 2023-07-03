import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { useClickOutside } from "@mantine/hooks";

import colorNames from "@/utils/color-names.json";
import preventLeave from "@/utils/preventLeave";

import type EditableInput from "@/types/EditableInput";
import equalHSV from "@/utils/equalHSV";
import { IconColorPicker } from "@tabler/icons-react";
import tinycolor, { ColorFormats } from "tinycolor2";
import InputColor from "../ColorPicker/InputColor";
import InputLabel from "../input/InputLabel";
import ActionButton from "../ui/ActionButton";
import DisplayCell from "../ui/DisplayCell";
import Popover from "../ui/Popover";

// Scroll in color palette will not work in modal due to radix bug (25.05.2023)

const colorNameKeys = Object.keys(colorNames);
const colorNamesRGB: [number, number, number][] = colorNameKeys.map((val) => [
  parseInt(val.substring(1, 3), 16),
  parseInt(val.substring(3, 5), 16),
  parseInt(val.substring(5, 7), 16),
]);

export const getColorNameFromHex = (hex: string) => {
  let name = "Nieznany";
  if (colorNames[hex as keyof typeof colorNames] !== undefined) {
    name = colorNames[hex as keyof typeof colorNames];
  } else {
    let min = 100000.0;
    let min_index = -1;

    const hex_r = parseInt(hex.substring(1, 3), 16);
    const hex_g = parseInt(hex.substring(3, 5), 16);
    const hex_b = parseInt(hex.substring(5, 7), 16);

    colorNamesRGB.forEach(([val_r, val_g, val_b], index) => {
      const weight = Math.sqrt(
        (val_r - hex_r) * (val_r - hex_r) +
          (val_g - hex_g) * (val_g - hex_g) +
          (val_b - hex_b) * (val_b - hex_b)
      );
      if (min > weight) {
        min = weight;
        min_index = index;
      }
    });

    if (min_index !== -1) {
      name =
        colorNames[colorNameKeys[min_index] as keyof typeof colorNames] + "*";
    }
  }
  return name;
};

interface EditableColorProps extends EditableInput<string> {
  style?: CSSProperties;
}

const EditableColor = (props: EditableColorProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    style,
    leftSection,
    rightSection,
  } = props;
  const uuid = useId();
  const [colorText, setColorText] = useState<string | null>(
    !!value && value.length > 3
      ? value
      : !!initialValue && initialValue.length > 3
      ? initialValue
      : ""
  );

  const ref = useClickOutside(() => setFocus(false));

  const colorTextObj = tinycolor(colorText ?? "");
  const colorTextHSV = colorTextObj.toHsv();
  const [color, setColor] = useState({
    ...colorTextHSV,
    h: colorTextHSV.h / 360,
  });

  const [focus, setFocus] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const colorName = useMemo(
    () => (colorText !== null ? getColorNameFromHex(colorText) : ""),
    [colorText]
  );

  const setColorViaString = (val: string) => {
    setColorText(val);
    const valHSV = tinycolor(val).toHsv();
    setColor((prev) => (equalHSV(valHSV, prev) ? prev : valHSV));
  };

  const setColorViaHSVObj = (val: ColorFormats.HSVA) => {
    const valObj = tinycolor.fromRatio(val);
    let hex = valObj.toHex8String();
    if (hex.substring(7) === "ff") {
      hex = hex.substring(0, 7);
    }
    setColorText(hex);
    setColor((prev) => (equalHSV(val, prev) ? prev : val));
  };

  const onLoseFocus = () => {
    if (colorText !== value) {
      if (!colorText || colorText === null) {
        onSubmit?.(null);
        setColorText(null);
        return;
      }
      const colorObj = tinycolor(colorText);
      if (colorObj.isValid()) {
        let hex = colorObj.toHex8String();
        if (hex.substring(7) === "ff") {
          hex = hex.substring(0, 7);
        }
        onSubmit?.(hex);
        setColorText(hex);
      }
    }
  };

  useEffect(() => {
    if (focus) {
      inputRef.current?.focus();
      window.addEventListener("beforeunload", preventLeave);
    } else {
      onLoseFocus();
      window.removeEventListener("beforeunload", preventLeave);
    }
    // eslint-disable-next-line
  }, [focus]);

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", preventLeave);
    };
  }, []);

  useEffect(() => {
    const valueObj = tinycolor(value);
    const valueHSV = { ...valueObj.toHsv(), h: valueObj.toHsv().h / 360 };
    if (equalHSV(valueHSV, color)) {
      setColorViaHSVObj(valueHSV);
    }
  }, [value]);

  return (
    <div
      className="flex-grow"
      onClick={() => !disabled && setFocus(true)}
      onFocus={() => !disabled && setFocus(true)}
      ref={ref}
    >
      <InputLabel
        label={label}
        copyValue={colorText ?? ""}
        htmlFor={"inputColor_" + uuid}
      />
      <DisplayCell
        className={!colorTextObj.isValid() ? "border-red-500" : ""}
        leftSection={
          !!leftSection ? (
            leftSection
          ) : (
            <div
              className="relative h-6 w-6 rounded-full before:absolute before:left-[0.0625rem] before:top-[0.0625rem] before:-z-10 before:h-[1.375rem] before:w-[1.375rem] before:rounded-full before:bg-white"
              style={{ background: colorText ?? "" }}
            ></div>
          )
        }
        rightSection={
          <Popover
            onOpenChange={onLoseFocus}
            modal={false}
            trigger={
              !!rightSection ? (
                rightSection
              ) : (
                <div className="flex h-11 items-center justify-center">
                  <ActionButton className="border-none">
                    <IconColorPicker />
                  </ActionButton>
                </div>
              )
            }
            contentProps={{
              align: "end",
              sideOffset: 5,
              className:
                "pb-3 overflow-hidden rounded bg-stone-200 shadow data-[state=open]:animate-show dark:bg-stone-950",
            }}
          >
            <InputColor value={color} onChange={setColorViaHSVObj} />
          </Popover>
        }
        focus={focus}
      >
        <input
          type="text"
          autoCorrect="false"
          spellCheck="false"
          id={"inputColor_" + uuid}
          value={colorText ?? ""}
          onChange={(e) => setColorViaString(e.target.value)}
          className={`
              data-disabled:text-gray-500
              dark:data-disabled:text-gray-500
              w-full
              resize-none
              whitespace-pre-line
              break-words
              bg-transparent
              py-1
              text-sm
              outline-none
              focus-visible:border-transparent
              focus-visible:outline-none
              `}
          readOnly={disabled}
          required={required}
          autoComplete="off"
          ref={inputRef}
        />
      </DisplayCell>
    </div>
  );
};

export default EditableColor;
