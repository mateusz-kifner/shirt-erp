import DisplayCellExpanding from "@/components/ui/DisplayCellExpanding";
import { Label } from "@/components/ui/Label";
import type EditableInput from "@/schema/EditableInput";
import { type Address } from "@/schema/addressZodSchema";
import EditableEnum from "./EditableEnum";
import { useEditableContext } from "./Editable";
import EditableText from "./EditableText";
import { cn } from "@/utils/cn";
import useTranslation from "@/hooks/useTranslation";
import { useFlagContext } from "@/context/flagContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog";
import EditableObject from "./EditableObject";
import { Dispatch, SetStateAction, useState } from "react";
import { useClickOutside } from "@mantine/hooks";

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

const addressToString = (address?: Omit<Address, "id">) => {
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

interface EditableAddressProps extends EditableInput<Omit<Address, "id">> {
  maxLength?: number;
}

function EditableAddressContent(props: {
  keyName?: string | number;
  enumOpen?: boolean;
  setEnumOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const { keyName, enumOpen, setEnumOpen } = props;
  const t = useTranslation();

  return (
    <div className="flex flex-grow flex-col gap-2 pb-3">
      <EditableObject keyName={keyName}>
        <EditableText
          label={t.streetName}
          keyName="streetName"
          className="text-stone-800 dark:text-stone-200"
        />
        <div className="flex flex-grow gap-2">
          <EditableText
            label={t.streetNumber}
            keyName="streetNumber"
            className="text-stone-800 dark:text-stone-200"
          />
          <EditableText
            label={t.apartmentNumber}
            keyName="apartmentNumber"
            className="text-stone-800 dark:text-stone-200"
          />
        </div>
        <EditableText
          label={t.secondLine}
          keyName="secondLine"
          className="text-stone-800 dark:text-stone-200"
        />
        <EditableText
          label={t.postCode}
          keyName="postCode"
          className="text-stone-800 dark:text-stone-200"
        />
        <EditableText
          label={t.city}
          keyName="city"
          className="text-stone-800 dark:text-stone-200"
        />
        <div className="flex flex-grow flex-col">
          <Label label={t.province} />
          <EditableEnum
            keyName="province"
            enum_data={provinces}
            open={enumOpen}
            onOpenChange={setEnumOpen}
          />
        </div>
      </EditableObject>
    </div>
  );
}

function EditableAddressExtend(props: EditableAddressProps) {
  const {
    label,
    value,
    onSubmit,
    disabled,
    required,
    // maxLength,
    leftSection,
    rightSection,
    keyName,
  } = useEditableContext(props);
  const [focus, setFocus] = useState<boolean>(false);
  const [enumOpen, setEnumOpen] = useState<boolean>(false);

  const onFocus = () => !disabled && setFocus(true);
  const onBlur = () => !enumOpen && setFocus(false);
  const ref = useClickOutside(onBlur);

  const valueString = addressToString(value);
  return (
    <div className="flex-grow">
      <Label label={label} copyValue={valueString} required={required} />
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
        {focus ? (
          <EditableAddressContent
            keyName={keyName}
            enumOpen={enumOpen}
            setEnumOpen={setEnumOpen}
          />
        ) : (
          valueString || "⸺"
        )}
      </DisplayCellExpanding>
    </div>
  );
}

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
    keyName,
  } = useEditableContext(props);
  const valueString = addressToString(value);
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
        <EditableAddressContent keyName={keyName} />
      </DisplayCellExpanding>
    </div>
  );
}

interface EditableAddress2Props extends EditableInput<Omit<Address, "id">> {
  maxLength?: number;
}

const EditableAddressPopover = (props: EditableAddress2Props) => {
  const {
    label,
    value,
    onSubmit,
    disabled,
    required,
    // maxLength,
    leftSection,
    rightSection,
    keyName,
  } = useEditableContext(props);

  const valueString = addressToString(value);

  return (
    <div className="flex flex-grow flex-col">
      <Label label={label} copyValue={valueString} required={required} />
      <Dialog>
        <DialogTrigger>
          <DisplayCellExpanding
            className={cn(
              "h-auto  px-2 py-2 text-left focus-within:ring-0",
              !valueString
                ? "text-gray-400 dark:text-stone-600"
                : "text-stone-950 dark:text-stone-200",
            )}
            disabled={disabled}
            leftSection={leftSection}
            rightSection={rightSection}
          >
            {valueString ?? "⸺"}
          </DisplayCellExpanding>
        </DialogTrigger>

        <DialogContent>
          {props.label !== undefined && (
            <DialogHeader>
              <DialogTitle>{props.label}</DialogTitle>
            </DialogHeader>
          )}
          <EditableAddressContent keyName={keyName} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const EditableAddress = (props: EditableAddressProps) => {
  const { editableAddressMode } = useFlagContext();

  if (editableAddressMode === "always_visible")
    return <EditableAddressAlwaysVisible {...props} />;

  if (editableAddressMode === "extend")
    return <EditableAddressExtend {...props} />;

  return <EditableAddressPopover {...props} />;
};

export default EditableAddress;
