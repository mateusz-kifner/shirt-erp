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
import useTranslation from "@/hooks/useTranslation";
import EditableAddressContent from "./EditableAddressContent";
import { Card, CardContent } from "../ui/Card";
import { useFlagContext } from "@/context/flagContext";

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

interface EditableAddressProps extends EditableInput<Omit<Address, "id">> {
  maxLength?: number;
}

const defaultValue = {
  streetName: "",
  streetNumber: "",
  apartmentNumber: "",
  secondLine: "",
  postCode: "",
  city: "",
  province: "",
};

function EditableAddressAlwaysVisible(props: EditableAddressProps) {
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

  const toString = () => {
    if (!value) return undefined;
    return (
      (value.streetName ? `ul. ${value.streetName} ` : "") +
      (value.streetNumber || "") +
      (value.apartmentNumber ? ` / ${value.apartmentNumber}` : "") +
      (value.streetName || value.streetNumber || value.apartmentNumber
        ? "\n"
        : "") +
      (value.secondLine ? value.secondLine + "\n" : "") +
      (value.postCode ? value.postCode + " " : "") +
      (value.city || "") +
      (value.postCode || value.city ? "\n" : "") +
      value.province
    );
  };

  const valueString = toString();
  return (
    <div className="flex-grow">
      <Label label={label} copyValue={valueString} required={required} />
      <DisplayCellExpanding
        className={cn(
          " h-auto  bg-transparent px-2 py-2 focus-within:ring-0",
          !valueString
            ? "text-gray-400 dark:text-stone-600"
            : "text-stone-950 dark:text-stone-200",
        )}
        disabled={disabled}
        leftSection={!focus && leftSection}
        rightSection={rightSection}
      >
        <div className="flex flex-grow flex-col gap-2 pb-3">
          <EditableAddressContent
            data={value ?? defaultValue}
            onSubmit={(key, val) => {
              if (value !== undefined) {
                onSubmit({ ...value, [key]: val });
                return;
              }
              onSubmit({ ...defaultValue, [key]: val });
            }}
          />
        </div>
      </DisplayCellExpanding>
    </div>
  );
}

const EditableAddress = (props: EditableAddressProps) => {
  const { editableAddressMode } = useFlagContext();

  if (editableAddressMode === "always_visible")
    return <EditableAddressAlwaysVisible {...props} />;

  return <></>;

  // console.log(value);
  // const [address, setAddress] = useState<Omit<Address, "id">>(
  //   value ?? {
  //     streetName: "",
  //     streetNumber: "",
  //     apartmentNumber: "",
  //     secondLine: "",
  //     postCode: "",
  //     city: "",
  //     province: "",
  //   },
  // );
  // const [focus, setFocus] = useState<boolean>(false);
  // const [enumOpen, setEnumOpen] = useState<boolean>(false);
  // const t = useTranslation();

  // const returnFocus = useFocusReturn({
  //   opened: enumOpen,
  // });
  // const onFocus = () => !disabled && setFocus(true);
  // const onBlur = () => {
  //   if (!enumOpen) {
  //     onFocusLose();
  //     setFocus(false);
  //   }
  // };
  // const ref = useClickOutside(onBlur);
  // const refStreetName = useRef<HTMLTextAreaElement | null>(null);
  // const refStreetNumber = useRef<HTMLTextAreaElement | null>(null);
  // const refApartmentNumber = useRef<HTMLTextAreaElement | null>(null);
  // const refSecondLine = useRef<HTMLTextAreaElement | null>(null);
  // const refPostCode = useRef<HTMLTextAreaElement | null>(null);
  // const refCity = useRef<HTMLTextAreaElement | null>(null);

  // const onFocusLose = () => {
  //   console.log(
  //     refStreetName.current?.value,
  //     refStreetNumber.current?.value,
  //     refApartmentNumber.current?.value,
  //     refSecondLine.current?.value,
  //     refPostCode.current?.value,
  //     refCity.current?.value,
  //   );
  //   value &&
  //     refStreetName.current !== null &&
  //     refStreetNumber.current !== null &&
  //     refApartmentNumber.current !== null &&
  //     refSecondLine.current !== null &&
  //     refPostCode.current !== null &&
  //     refCity.current !== null &&
  //     onSubmit?.({
  //       ...value,
  //       streetName: refStreetName.current?.value ?? "",
  //       streetNumber: refStreetNumber.current?.value ?? "",
  //       apartmentNumber: refApartmentNumber.current?.value ?? "",
  //       secondLine: refSecondLine.current?.value ?? "",
  //       postCode: refPostCode.current?.value ?? "",
  //       city: refCity.current?.value ?? "",
  //     });
  // };

  // const setAddressField = (key: string, val: string) => {
  //   const new_address = { ...address, [key]: val } as Address;
  //   const prevAddress = value;

  //   if (!isEqual(prevAddress, new_address)) {
  //     setAddress(new_address);
  //     console.log(new_address);
  //     onSubmit?.(new_address);
  //   }
  // };

  // useEffect(() => {
  //   if (value && !isEqual(address, value)) {
  //     setAddress({ ...value });
  //   }
  //   //eslint-disable-next-line
  // }, [
  //   value?.streetName,
  //   value?.streetNumber,
  //   value?.apartmentNumber,
  //   value?.secondLine,
  //   value?.postCode,
  //   value?.city,
  //   value?.province,
  // ]);

  // const toString = () => {
  //   if (!address) return undefined;
  //   return (
  //     (address.streetName ? `ul. ${address.streetName} ` : "") +
  //     (address.streetNumber || "") +
  //     (address.apartmentNumber ? ` / ${address.apartmentNumber}` : "") +
  //     (address.streetName || address.streetNumber || address.apartmentNumber
  //       ? "\n"
  //       : "") +
  //     (address.secondLine ? address.secondLine + "\n" : "") +
  //     (address.postCode ? address.postCode + " " : "") +
  //     (address.city || "") +
  //     (address.postCode || address.city ? "\n" : "") +
  //     address.province
  //   );
  // };

  // const valueString = toString();

  // return (
  //   <div className="flex-grow">
  //     <Label label={label} copyValue={toString()} required={required} />
  //     <DisplayCellExpanding
  //       className={cn(
  //         "h-auto  px-2 py-2 focus-within:ring-0",
  //         !valueString
  //           ? "text-gray-400 dark:text-stone-600"
  //           : "text-stone-950 dark:text-stone-200",
  //         focus && "bg-transparent",
  //       )}
  //       ref={ref}
  //       onClick={onFocus}
  //       onFocus={onFocus}
  //       disabled={disabled}
  //       leftSection={!(focus || enumOpen) && leftSection}
  //       rightSection={rightSection}
  //       focus={focus}
  //     >
  //       {focus || enumOpen ? (
  //         <div
  //           style={{ position: "relative" }}
  //           className="flex flex-grow flex-col gap-2 pb-3"
  //           // tabIndex={99999} // ensure that focus can be captured on element
  //         >
  //           <Editable
  //             data={address}
  //             onSubmit={(key, value) => setAddressField(key as string, value)}
  //           >
  //             <EditableText
  //               ref={refStreetName}
  //               label={t.streetName}
  //               keyName="streetName"
  //               className="text-stone-800 dark:text-stone-200"
  //             />
  //             <div className="flex flex-grow gap-2">
  //               <EditableText
  //                 ref={refStreetNumber}
  //                 label={t.streetNumber}
  //                 keyName="streetNumber"
  //                 className="text-stone-800 dark:text-stone-200"
  //               />
  //               <EditableText
  //                 ref={refApartmentNumber}
  //                 label={t.apartmentNumber}
  //                 keyName="apartmentNumber"
  //                 className="text-stone-800 dark:text-stone-200"
  //               />
  //             </div>
  //             <EditableText
  //               ref={refSecondLine}
  //               label={t.secondLine}
  //               keyName="secondLine"
  //               className="text-stone-800 dark:text-stone-200"
  //             />
  //             <EditableText
  //               ref={refPostCode}
  //               label={t.postCode}
  //               keyName="postCode"
  //               className="text-stone-800 dark:text-stone-200"
  //             />
  //             <EditableText
  //               ref={refCity}
  //               label={t.city}
  //               keyName="city"
  //               className="text-stone-800 dark:text-stone-200"
  //             />
  //             <div className="flex flex-grow flex-col">
  //               <Label label={t.province} />
  //               <EditableEnum
  //                 keyName="provinces"
  //                 enum_data={provinces}
  //                 open={enumOpen}
  //                 onOpenChange={(open) => {
  //                   setEnumOpen(open);
  //                   !open && returnFocus();
  //                 }}
  //               />
  //             </div>
  //           </Editable>
  //         </div>
  //       ) : (
  //         toString() || "⸺"
  //       )}
  //     </DisplayCellExpanding>
  //   </div>
  // );
};

export default EditableAddress;
