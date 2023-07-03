import type { ComponentType, CSSProperties } from "react";

import { useId } from "@mantine/hooks";
import {
  IconBuildingCommunity,
  IconCalendar,
  IconCash,
  IconNumbers,
} from "@tabler/icons-react";

// Editable imports
import EditableAddress from "@/components/editable/EditableAddress";
import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableApiEntryId from "@/components/editable/EditableApiEntryId";
import EditableApiIconId from "@/components/editable/EditableApiIconId";
import EditableArray from "@/components/editable/EditableArray";
import EditableColor from "@/components/editable/EditableColor";
import EditableDate from "@/components/editable/EditableDate";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableEnum from "@/components/editable/EditableEnum";
import EditableFiles from "@/components/editable/EditableFiles";
import EditableJSON from "@/components/editable/EditableJSON";
import EditableRichText from "@/components/editable/EditableRichText";
import EditableSwitch from "@/components/editable/EditableSwitch";
import EditableText from "@/components/editable/EditableText";

import apiListItems from "@/components/editable/apiListItems";
import NotImplemented from "@/components/NotImplemented";
import { useUserContext } from "@/context/userContext";
import { makeDefaultListItem } from "../DefaultListItemWithValue";
import EditableNumber from "./EditableNumber";
import EditableShortText from "./EditableShortText";

interface BaseTemplateType<TName, TValue = string> {
  label: string;
  type: TName;
  initialValue?: TValue;
  required?: boolean;
  disabled?: boolean;
  helpTooltip?: string;
}

type TemplateStringType = BaseTemplateType<"text" | "title" | "richtext"> & {
  maxLength: number;
};

type TemplateDateType = BaseTemplateType<"datetime" | "date">;

type TemplateNumberType = BaseTemplateType<"number", number> & {
  min: number;
  increment: number;
  fixed: number;
};

type TemplateArrayType = BaseTemplateType<"array", any[]> & {
  arrayType: "title" | "text" | "apiEntry" | "datetime" | "date";
};

type TemplateApiEntryType = BaseTemplateType<"apiEntry", any> & {
  entryName: string;
  linkEntry?: boolean;
  allowClear?: boolean;
  onSubmitTrigger?: (
    key: string,
    entryData: any, // Data of this entry
    inputData: any, // Additional data
    onSubmit: (key: string, value: any, data: any) => void
  ) => void;
};

type TemplateAddressType = {
  type: "address";
  label: {
    streetName: string;
    streetNumber: string;
    apartmentNumber: string;
    secondLine: string;
    city: string;
    province: string;
    postCode: string;
    name: string;
  };
  initialValue: {
    streetName: string;
    streetNumber: string;
    apartmentNumber: string;
    secondLine: string;
    city: string;
    province: string;
    postCode: string;
  };
  allowClear?: boolean;
};

type TemplateFilesType = BaseTemplateType<"files", any[]> & {
  maxFileCount: number;
};

type TemplateEnumType = BaseTemplateType<"enum", string> & {
  enum_data: string[];
};

type TemplateBooleanType = BaseTemplateType<"boolean", boolean> & {
  children: { checked: string; unchecked: string };
};

type TemplateIdType = { type: "id" };

type TemplateType =
  | TemplateStringType
  | TemplateNumberType
  | TemplateDateType
  | TemplateEnumType
  | TemplateAddressType
  | TemplateApiEntryType
  | TemplateBooleanType
  | TemplateApiEntryType
  | TemplateArrayType
  | TemplateFilesType
  | TemplateIdType;

type DataType =
  | (TemplateStringType & { value: string })
  | (TemplateNumberType & { value: number })
  | (TemplateDateType & { value: string })
  | (TemplateEnumType & { value: string })
  | (TemplateAddressType & {
      value: {
        streetName: string;
        streetNumber: string;
        apartmentNumber: string;
        secondLine: string;
        city: string;
        province: string;
        postCode: string;
      };
    })
  | (TemplateApiEntryType & { value: any })
  | (TemplateBooleanType & { value: boolean })
  | (TemplateArrayType & { value: any[] })
  | (TemplateFilesType & { value: any[] });

type TemplateSimpleTypePropertyType =
  | "title"
  | "text"
  | "apiEntry"
  | "datetime"
  | "date"
  | "richtext"
  | "number"
  | "enum"
  | "files";

type TemplateTypePropertyType = Extract<
  TemplateSimpleTypePropertyType | "array" | "group",
  string
>;

export type editableFields = {
  [key: string]: {
    component: ComponentType<any>;
    props: { [index: string]: any };
    propsTransform?: (props: { [index: string]: any }) => {
      [index: string]: any;
    };
  };
};

const editableFields: editableFields = {
  title: {
    component: EditableShortText,
    props: { style: { fontSize: "1.4em" } },
  },
  text: { component: EditableText, props: {} },
  numberText: {
    component: EditableShortText,
    props: { leftSection: <IconNumbers size={18} /> },
  },
  richtext: { component: EditableRichText, props: {} },
  number: {
    component: EditableNumber,
    props: { leftSection: <IconNumbers size={18} /> },
  },
  money: {
    component: EditableShortText,
    props: {
      rightSection: <div className="pr-2">PLN</div>,
      leftSection: <IconCash size={18} />,
    },
  },
  datetime: { component: EditableDateTime, props: {} },
  date: {
    component: EditableDate,
    props: { leftSection: <IconCalendar size={18} /> },
  },
  switch: { component: EditableSwitch, props: {} },
  color: { component: EditableColor, props: {} },
  enum: { component: EditableEnum, props: {} },
  json: { component: EditableJSON, props: {} },
  iconId: { component: EditableApiIconId, props: {} },
  address: {
    component: EditableAddress,
    props: { leftSection: <IconBuildingCommunity size={18} /> },
  },
  file: { component: EditableFiles, props: { maxCount: 1 } },
  image: { component: EditableFiles, props: { maxCount: 1 } },
  files: { component: EditableFiles, props: {} },
  apiEntry: {
    component: EditableApiEntry,
    props: {},
    propsTransform: (props) => {
      const newProps = { ...props };
      if (props.entryName in apiListItems) {
        newProps["Element"] =
          apiListItems[props.entryName as keyof typeof apiListItems].ListItem;
        newProps["copyProvider"] =
          apiListItems[
            props.entryName as keyof typeof apiListItems
          ].copyProvider;
      } else {
        newProps["Element"] = makeDefaultListItem("name");
      }
      return newProps;
    },
  },
  apiEntryId: {
    component: EditableApiEntryId,
    props: {},
    propsTransform: (props) => {
      const newProps = { ...props };
      if (props.entryName in apiListItems) {
        newProps["Element"] =
          apiListItems[props.entryName as keyof typeof apiListItems].ListItem;
        newProps["copyProvider"] =
          apiListItems[
            props.entryName as keyof typeof apiListItems
          ].copyProvider;
      } else {
        newProps["Element"] = makeDefaultListItem("name");
      }
      return newProps;
    },
  },
  group: {
    component: EditableWrapper,
    props: {
      // sx: [
      //   SxBorder,
      //   SxRadius,
      //   (theme: MantineTheme) => ({
      //     padding: theme.spacing.xs,
      //     display: "flex",
      //     gap: theme.spacing.xs,
      //     "&>*": { flex: "1" },
      //   }),
      // ],
    },
    propsTransform: (props) => {
      const newProps = {
        ...props,
        data: props.value ?? {},
        onSubmit: (key: string, value: any, data: any) => {
          console.log("group submit", key, value, data);
          props.onSubmit({ ...data, [key]: value });
        },
      };

      return newProps;
    },
  },
  array: {
    component: EditableArray,
    props: {},
    propsTransform: (props) => {
      const newProps = {
        ...props,
        Element: Field,
        elementProps: {
          ...props,
          type: props.arrayType,
        },
      };
      return newProps;
    },
  },
};

function Field(props: { [index: string]: any }) {
  let newProps = {
    ...editableFields[props.type as keyof typeof editableFields]!.props,
    ...props,
  };
  if (
    editableFields[props.type as keyof typeof editableFields]!.propsTransform
  ) {
    newProps =
      editableFields[props.type as keyof typeof editableFields]!
        .propsTransform!(newProps);
  }
  const Component =
    editableFields[props.type as keyof typeof editableFields]!.component;
  return <Component {...newProps} type={undefined} />;
}

function EditableWrapper(
  props: EditableProps & { style?: CSSProperties; className: string }
) {
  return (
    <div style={props.style} className={props.className}>
      <Editable {...props} />
    </div>
  );
}

interface EditableProps {
  template: { [key: string]: any };
  data: { [key: string]: any };
  onSubmit?: (key: string, value: any, data: any) => void;
  disabled?: boolean;
}

function Editable({ template, data, onSubmit, disabled }: EditableProps) {
  const { debug } = useUserContext();
  const uuid = useId();
  return (
    <>
      {Object.keys(template).map((key) => {
        if (debug && key === "id")
          return <div key={uuid + key}>ID: {data[key]}</div>;

        const onSubmitEntry = (value: any) => {
          onSubmit?.(key, value, data);
          onSubmit &&
            template[key].onSubmitTrigger &&
            template[key].onSubmitTrigger(
              key,
              value,
              data,
              (key: string, value: any, data: any) => {
                onSubmit(key, value, data);
              }
            );
        };

        if (debug && !(key in template))
          return (
            <NotImplemented
              message={"Key doesn't have template"}
              object_key={key}
              value={data[key]}
              key={uuid + key}
            />
          );

        const component_type = template[key].type;
        if (component_type in editableFields) {
          return (
            <Field
              disabled={disabled}
              value={data[key]}
              object_key={key}
              {...template[key]}
              onSubmit={onSubmitEntry}
              key={uuid + key}
            />
          );
        }
        if (debug) {
          return (
            <NotImplemented
              message={"Key has unknown type"}
              object_key={key}
              value={data[key]}
              template={template[key]}
              key={uuid + key}
            />
          );
        }
        return null;
      })}
    </>
  );
}

export default Editable;
