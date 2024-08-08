import { useEffect, useState, type CSSProperties } from "react";

import { useId } from "@mantine/hooks";
import { IconExternalLink, IconTrashX } from "@tabler/icons-react";
import _ from "lodash";
import Link from "next/link";

import Button, { buttonVariants } from "@/components/ui/Button";
import useTranslation from "@/hooks/useTranslation";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import type EditableInput from "@/types/EditableInput";
import { cn } from "@/utils/cn";
import ApiList from "../ApiList";
import { useEditableContext } from "./Editable";
import navigationData from "../layout/Navigation/navigationData";

interface EditableApiEntryProps<
  TEntry extends { id?: number; [key: string]: any },
> extends EditableInput<TEntry> {
  entryName: string;
  // Element: React.ElementType;
  copyProvider?: (value: TEntry | null) => string | undefined;
  style?: CSSProperties;
  listProps?: any;
  linkEntry?: boolean;
  helpTooltip?: string;
  allowClear?: boolean;
}

const EditableApiEntry = <TEntry extends { id?: number; [key: string]: any }>(
  props: EditableApiEntryProps<TEntry>,
) => {
  const {
    label,
    value,
    onSubmit,
    disabled,
    required,
    // Element,
    entryName,
    copyProvider = () => "",
    // style,
    listProps,
    linkEntry,
    helpTooltip,
    allowClear,

    keyName,
  } = useEditableContext(props);

  const [apiEntry, setApiEntry] = useState<any>(value);
  const [prev, setPrev] = useState<any>(apiEntry);
  const [open, setOpen] = useState<boolean>(false);
  const uuid = useId();
  const copyValue = copyProvider(apiEntry);
  const t = useTranslation();

  useEffect(() => {
    setApiEntry(value);
    setPrev(value);
  }, [value]);

  useEffect(() => {
    if (_.isEqual(apiEntry, prev)) return;

    onSubmit?.(apiEntry);
    setPrev(apiEntry);
  }, [apiEntry, onSubmit]);

  const gradient =
    navigationData?.[entryName as keyof typeof navigationData]?.gradient;

  const color =
    navigationData?.[entryName as keyof typeof navigationData]?.gradient?.to;

  const gradientCSS = `linear-gradient(${gradient?.deg ?? 0}deg, ${
    gradient ? `${gradient.to}33` : color
  },${gradient ? `${gradient.from}33` : color} )`;

  const columns = ["name"];
  const columnsExpanded = ["name"];
  // const columnsExpanded = Object.keys(global_properties).filter(
  //   (v) => !v.endsWith("ById"),
  // );

  return (
    <div>
      <Label
        label={label}
        copyValue={apiEntry && copyValue ? copyValue : ""}
        required={required}
        helpTooltip={helpTooltip}
      />

      <Dialog
        open={open}
        onOpenChange={(open) => !disabled && setOpen(open)}
        // onClose={() => setOpen(false)}
        // contentProps={{
        //   className: "w-[30rem] max-w-screen min-h-[50rem] max-h-screen",
        // }}
      >
        <DialogTrigger asChild>
          {entryName ? (
            <div
              key={uuid}
              className={`relative flex overflow-hidden rounded border border-solid${
                open ? "border-sky-600 dark:border-sky-600" : "border-border"
              }`}
            >
              <div
                onClick={() => !disabled && setOpen(true)}
                // value={apiEntry}
                // disabled={disabled}
              >
                {apiEntry?.name}
              </div>
              {linkEntry && value && value?.id && (
                <div className="-translate-y-1/2 absolute top-1/2 right-3">
                  <Link
                    href={`/erp/${entryName}/${value?.id}`}
                    className={cn(
                      buttonVariants({ size: "icon", variant: "ghost" }),
                      "",
                    )}
                    tabIndex={-1}
                  >
                    <IconExternalLink size={18} />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-500">
              Entry Name not valid or element was not defined in mapping
            </div>
          )}
        </DialogTrigger>
        <DialogContent>
          <div className="h-8">
            {allowClear ? (
              <Button
                onClick={() => {
                  setOpen(false);
                  //@ts-ignore
                  onSubmit?.(null);
                }}
                leftSection={<IconTrashX size={12} />}
                className="h-8 p-3 text-xs"
              >
                {t.clear}
              </Button>
            ) : undefined}
          </div>
          {entryName ? (
            <ApiList
              columns={columns}
              columnsExpanded={columnsExpanded}
              filterKeys={["name"]}
              entryName={entryName ?? ""}
              selectedColor={gradient ? gradientCSS : undefined}
              onChange={(id) => {
                setOpen(false);
                setApiEntry({ id });
              }}
            />
            // <ApiList
            //   entryName={entryName ?? ""}
            //   ListItem={Element}
            //   label={
            //     entryName
            //       ? _.capitalize(
            //           (
            //             t[entryName as keyof typeof t] as {
            //               singular: string;
            //               plural: string;
            //             }
            //           )?.plural,
            //         )
            //       : undefined
            //   }
            //   onChange={(value) => {
            //     setOpen(false);
            //     setApiEntry(value);
            //   }}
            //   excludeKey="name"
            //   excludeValue="Szablon"
            //   {...listProps}
            // />
          ) : (
            <div className="text-red-500">
              Entry Name not valid or element was not defined in mapping
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditableApiEntry;
