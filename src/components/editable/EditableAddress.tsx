import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useClickOutside, useFocusReturn } from "@mantine/hooks";
import { isEqual } from "lodash";

import DisplayCellExpanding from "@/components/ui/DisplayCellExpanding";
import { Label } from "@/components/ui/Label";
import type EditableInput from "@/schema/EditableInput";
import { type Address } from "@/schema/addressZodSchema";
import { Input } from "../ui/Input";
import EditableEnum from "./EditableEnum";
import Editable, { useEditableContext } from "./Editable";
import EditableText from "./EditableText";
import { cn } from "@/utils/cn";

const provinces = [
  "dolnośląskie",
  "kujawsko-pomorskie",
  "lubelskie",
  "lubuskie",
  "łódzkie",
  "małopolskie",
  "mazowieckie",
  "opolskie",
  "podkarpackie",
  "podlaskie",
  "pomorskie",
  "śląskie",
  "świętokrzyskie",
  "warmińsko-mazurskie",
  "wielkopolskie",
  "zachodniopomorskie",
];

interface EditableAddressProps extends Omit<EditableInput<Address>, "label"> {
  label?: Omit<Address & { name: string }, "id">;
  maxLength?: number;
}

const EditableAddress = (props: EditableAddressProps) => {
  const {
    label,
    value,
    onSubmit,
    disabled,
    required,
    // maxLength,
    leftSection,
    rightSection,
    // keyName,
  } = useEditableContext(props);
  // console.log(value);
  const [address, setAddress] = useState<Address>(value!);
  const [focus, setFocus] = useState<boolean>(false);
  const [enumOpen, setEnumOpen] = useState<boolean>(false);

  const returnFocus = useFocusReturn({
    opened: enumOpen,
  });
  const onFocus = () => !disabled && setFocus(true);
  const onBlur = () => {
    if (!enumOpen) {
      setFocus(false);
    }
  };
  const ref = useClickOutside(onBlur);

  const setAddressField = (key: string, val: string) => {
    const new_address = { ...address, [key]: val } as Address;
    const prevAddress = value;

    if (!isEqual(prevAddress, new_address)) {
      setAddress(new_address);
      onSubmit?.(new_address);
    }
  };

  useEffect(() => {
    if (value && !isEqual(address, value)) {
      setAddress({ ...value });
    }
    //eslint-disable-next-line
  }, [
    value?.streetName,
    value?.streetNumber,
    value?.apartmentNumber,
    value?.secondLine,
    value?.postCode,
    value?.city,
    value?.province,
  ]);

  const toString = () => {
    if (!address) return undefined;
    return (
      (address.streetName ? `ul. ${address.streetName} ` : "") +
      (address.streetNumber || "") +
      (address.apartmentNumber ? ` / ${address.apartmentNumber}` : "") +
      (address.streetName || address.streetNumber || address.apartmentNumber
        ? "\n"
        : "") +
      (address.secondLine ? address.secondLine + "\n" : "") +
      (address.postCode ? address.postCode + " " : "") +
      (address.city || "") +
      (address.postCode || address.city ? "\n" : "") +
      address.province
    );
  };

  const valueString = toString();

  return (
    <div className="flex-grow">
      <Label label={label?.name} copyValue={toString()} required={required} />
      <DisplayCellExpanding
        className={cn(
          "h-auto  px-2 py-2 focus-within:ring-0",
          !valueString
            ? "text-gray-400 dark:text-stone-600"
            : "text-stone-950 dark:text-stone-200",
          focus && "bg-transparent",
        )}
        ref={ref}
        onClick={onFocus}
        onFocus={onFocus}
        disabled={disabled}
        leftSection={!(focus || enumOpen) && leftSection}
        rightSection={rightSection}
        focus={focus}
      >
        {focus || enumOpen ? (
          <div
            style={{ position: "relative" }}
            className="flex flex-grow flex-col gap-2 pb-3"
            // tabIndex={99999} // ensure that focus can be captured on element
          >
            <Editable
              data={address}
              onSubmit={(key, value) => setAddressField(key as string, value)}
            >
              <EditableText
                label={label?.streetName ?? undefined}
                keyName="streetName"
                className="text-stone-800 dark:text-stone-200"
              />
              <div className="flex flex-grow gap-2">
                <EditableText
                  label={label?.streetNumber ?? undefined}
                  keyName="streetNumber"
                  className="text-stone-800 dark:text-stone-200"
                />
                <EditableText
                  label={label?.apartmentNumber ?? undefined}
                  keyName="apartmentNumber"
                  className="text-stone-800 dark:text-stone-200"
                />
              </div>
              <EditableText
                label={label?.secondLine ?? undefined}
                keyName="secondLine"
                className="text-stone-800 dark:text-stone-200"
              />
              <EditableText
                label={label?.postCode ?? undefined}
                keyName="postCode"
                className="text-stone-800 dark:text-stone-200"
              />
              <EditableText
                label={label?.city ?? undefined}
                keyName="city"
                className="text-stone-800 dark:text-stone-200"
              />
              <div className="flex flex-grow flex-col">
                <Label label={label?.province} />
                <EditableEnum
                  keyName="provinces"
                  enum_data={provinces}
                  open={enumOpen}
                  onOpenChange={(open) => {
                    setEnumOpen(open);
                    !open && returnFocus();
                  }}
                />
              </div>
            </Editable>
          </div>
        ) : (
          toString() || "⸺"
        )}
      </DisplayCellExpanding>
    </div>
  );
};

export default EditableAddress;
