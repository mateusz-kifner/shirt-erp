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
import { Address } from "@/schema/addressZodSchema";
import { Input } from "../ui/Input";
import EditableEnum from "./EditableEnum";

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

interface InputAddressFieldProps {
  label?: string | null;
  value: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  onSubmit: (value: string) => void;
}

const InputAddressField = forwardRef<HTMLInputElement, InputAddressFieldProps>(
  (props, ref) => {
    const { label, value, leftSection, rightSection, onSubmit } = props;
    const [focus, setFocus] = useState<boolean>(false);
    const [val, setVal] = useState(value ?? "");
    const uuid = useId();

    useEffect(() => {
      if (!focus) {
        onSubmit?.(val);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focus]);

    useEffect(() => {
      if (value !== val) {
        setVal(value);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
      <div className="flex flex-grow flex-col">
        <Label
          htmlFor={`${uuid}:addressField:`}
          label={label}
          copyValue={value}
        />
        <Input
          id={`${uuid}:addressField:`}
          value={val}
          onChange={(e) => e.target.value !== null && setVal(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          focus={focus}
          leftSection={leftSection}
          rightSection={rightSection}
          ref={ref}
        />
      </div>
    );
  },
);

InputAddressField.displayName = "InputAddressField";

const EditableAddress = (props: EditableAddressProps) => {
  const {
    label,
    value,
    onSubmit,
    disabled,
    required,
    maxLength,
    leftSection,
    rightSection,
    keyName,
  } = props;
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
      onFocusLose();
      setFocus(false);
    }
  };
  const ref = useClickOutside(onBlur);
  const refStreetName = useRef<HTMLInputElement | null>(null);
  const refStreetNumber = useRef<HTMLInputElement | null>(null);
  const refApartmentNumber = useRef<HTMLInputElement | null>(null);
  const refSecondLine = useRef<HTMLInputElement | null>(null);
  const refPostCode = useRef<HTMLInputElement | null>(null);
  const refCity = useRef<HTMLInputElement | null>(null);

  const onFocusLose = () => {
    value &&
      refStreetName.current !== null &&
      refStreetNumber.current !== null &&
      refApartmentNumber.current !== null &&
      refSecondLine.current !== null &&
      refPostCode.current !== null &&
      refCity.current !== null &&
      onSubmit?.({
        ...value,
        streetName: refStreetName.current?.value ?? "",
        streetNumber: refStreetNumber.current?.value ?? "",
        apartmentNumber: refApartmentNumber.current?.value ?? "",
        secondLine: refSecondLine.current?.value ?? "",
        postCode: refPostCode.current?.value ?? "",
        city: refCity.current?.value ?? "",
      });
  };

  const setAddressField = (key: string, val: string) => {
    const new_address = { ...address, [key]: val } as Address;
    const prevAddress = value;

    if (!isEqual(prevAddress, new_address)) {
      setAddress(new_address);
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
        className={`px-2 ${
          !valueString
            ? "text-gray-400 dark:text-stone-600"
            : "text-stone-950 dark:text-stone-200"
        }`}
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
            <InputAddressField
              label={label?.streetName}
              value={address?.streetName ?? ""}
              onSubmit={(value: string) => {
                setAddressField("streetName", value);
              }}
              ref={refStreetName}
            />
            <div className="flex flex-grow gap-2">
              <InputAddressField
                label={label?.streetNumber}
                value={address?.streetNumber ?? ""}
                onSubmit={(value: string) => {
                  setAddressField("streetNumber", value);
                }}
                ref={refStreetNumber}
              />
              <InputAddressField
                label={label?.apartmentNumber}
                value={address?.apartmentNumber ?? ""}
                onSubmit={(value: string) => {
                  setAddressField("apartmentNumber", value);
                }}
                ref={refApartmentNumber}
              />
            </div>
            <InputAddressField
              label={label?.secondLine}
              value={address?.secondLine ?? ""}
              onSubmit={(value: string) => {
                setAddressField("secondLine", value);
              }}
              ref={refSecondLine}
            />
            <InputAddressField
              label={label?.postCode}
              value={address?.postCode ?? ""}
              onSubmit={(value: string) => {
                setAddressField("postCode", value);
              }}
              ref={refPostCode}
            />
            <InputAddressField
              label={label?.city}
              value={address?.city ?? ""}
              onSubmit={(value: string) => {
                setAddressField("city", value);
              }}
              ref={refCity}
            />
            <div className="flex flex-grow flex-col">
              <Label label={label?.province} />
              <EditableEnum
                value={address?.province ?? ""}
                onSubmit={(value) =>
                  value !== null && setAddressField("province", value)
                }
                enum_data={provinces}
                open={enumOpen}
                onOpenChange={(open) => {
                  setEnumOpen(open);
                  !open && returnFocus();
                }}
              />
            </div>
          </div>
        ) : (
          toString() || "⸺"
        )}
      </DisplayCellExpanding>
    </div>
  );
};

export default EditableAddress;
