import DisplayCellExpanding from "@/components/ui/DisplayCellExpanding";
import { Label } from "@/components/ui/Label";
import type EditableInput from "@/schema/EditableInput";
import { type Address } from "@/schema/addressZodSchema";
import EditableEnum from "./EditableEnum";
import Editable, { Key, useEditableContext } from "./Editable";
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
import { Dispatch, SetStateAction, useState } from "react";
import { useClickOutside } from "@mantine/hooks";
import { addressToString } from "@/utils/addressToString";
import { api } from "@/utils/api";
import { useLoaded } from "@/hooks/useLoaded";
import {  useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from '@trpc/react-query';



export const provinces = [
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

interface EditableAddressProps extends EditableInput<number> {
  maxLength?: number;
}

function EditableAddressContent(props: {
  enumOpen?: boolean;
  setEnumOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const { enumOpen, setEnumOpen } = props;
  const t = useTranslation();

  return (
    <div className="flex flex-grow flex-col gap-2 pb-3">
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
    </div>
  );
}

function EditableAddressExtend(props: EditableInput<Address>) {
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
  } = props;
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
            enumOpen={enumOpen}
            setEnumOpen={setEnumOpen}
          />
        ) : (
          valueString || "_____ __/__\n_____\n__-___ _____\n_____"
        )}
      </DisplayCellExpanding>
    </div>
  );
}

function EditableAddressAlwaysVisible(props: EditableInput<Address>) {
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
  } = props;
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
        <EditableAddressContent />
      </DisplayCellExpanding>
    </div>
  );
}

interface EditableAddress2Props extends EditableInput<Address> {
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
  } = props;

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
          <EditableAddressContent />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const EditableAddress = (props: EditableAddressProps) => {
  const { editableAddressMode } = useFlagContext();
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
  const isLoaded = useLoaded();
  const queryClient = useQueryClient()
  const { data, refetch } = api.address.getById.useQuery(value as number, {
    enabled: value !== undefined,
  });
  const addressGetByIdKey = getQueryKey(api.address.getById, value as number, 'query');
  const { mutateAsync: update } = api.address.update.useMutation({
    onSuccess: (data) => {
      queryClient.setQueryData(addressGetByIdKey, data)
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiUpdate = (key: Key, val: any) => {
    if (!isLoaded) return;
    if (!data) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    update({ id: data.id, [key]: val }).catch(console.log);
  };

  const valueString = addressToString(data);

  if (data === undefined ) {
    return (
      <div className="flex flex-grow flex-col">
        <Label label={label} required={required} />

        <DisplayCellExpanding
          className={cn(
            "h-auto  px-2 py-2 text-left focus-within:ring-0",
            "text-gray-400 dark:text-stone-600",
          )}
          disabled={disabled}
          leftSection={leftSection}
          rightSection={rightSection}
        >
          _____ __/__<br/>_____<br/>__-___ ____<br/>_____
        </DisplayCellExpanding>
      </div>
    );
  }

  let ModeElement = EditableAddressPopover;
  if (editableAddressMode === "always_visible")
    ModeElement = EditableAddressAlwaysVisible;
  if (editableAddressMode === "extend") ModeElement = EditableAddressExtend;

  return (
    <Editable onSubmit={apiUpdate} data={data}>
      <ModeElement label={label} value={data} />
    </Editable>
  );
};

export default EditableAddress;
