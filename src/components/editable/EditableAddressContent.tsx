import useTranslation from "@/hooks/useTranslation";
import Editable, { EditableProps } from "./Editable";
import EditableText from "./EditableText";
import { Label } from "../ui/Label";
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

function EditableAddressContent<T extends Record<string, any>>(
  props: Omit<EditableProps<T>, "children">,
) {
  const t = useTranslation();
  return (
    <Editable {...props}>
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
        <EditableEnum keyName="province" enum_data={provinces} />
      </div>
    </Editable>
  );
}

export default EditableAddressContent;
