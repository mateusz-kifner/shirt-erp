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
import ApiList from "../ApiListOld";
import { useEditableContext } from "./Editable";
import { trpc } from "@/utils/trpc";

interface EditableApiEntryProps<T> extends EditableInput<number | null> {
  entryName: string;
  Element: React.ElementType;
  copyProvider?: (value: T | null) => string | undefined;
  style?: CSSProperties;
  listProps?: any;
  linkEntry?: boolean;
  helpTooltip?: string;
  allowClear?: boolean;
}

const EditableApiEntry = <T extends Record<string, any>>(
  props: EditableApiEntryProps<T>,
) => {
  const {
    label,
    value,
    onSubmit,
    disabled,
    required,
    Element,
    entryName,
    copyProvider = () => "",
    // style,
    listProps,
    linkEntry,
    helpTooltip,
    allowClear,

    keyName,
  } = useEditableContext(props);

  const { data, refetch } = trpc[entryName as "customer"].getById.useQuery(
    value as number,
    {
      enabled: value !== undefined && value !== null,
    },
  );

  const [apiEntryId, setApiEntryId] = useState<any>(value);
  const [prev, setPrev] = useState<any>(apiEntryId);
  const [open, setOpen] = useState<boolean>(false);
  const uuid = useId();
  const copyValue = copyProvider((data as unknown as T) ?? null);
  const t = useTranslation();

  useEffect(() => {
    setApiEntryId(value);
    setPrev(value);
  }, [value]);

  useEffect(() => {
    if (_.isEqual(apiEntryId, prev)) return;

    onSubmit?.(apiEntryId);
    setPrev(apiEntryId);
  }, [apiEntryId]);

  return (
    <div>
      <Label
        label={label}
        copyValue={apiEntryId && copyValue ? copyValue : ""}
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
              <Element
                onChange={() => !disabled && setOpen(true)}
                value={data}
                disabled={disabled}
              />
              {linkEntry && value && (
                <div className="-translate-y-1/2 absolute top-1/2 right-3">
                  <Link
                    href={`/erp/${entryName}/${value}`}
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
              entryName={entryName ?? ""}
              ListItem={Element}
              label={
                entryName
                  ? _.capitalize(
                      (
                        t[entryName as keyof typeof t] as {
                          singular: string;
                          plural: string;
                        }
                      )?.plural,
                    )
                  : undefined
              }
              onChange={(value) => {
                setOpen(false);
                setApiEntryId(value.id);
              }}
              excludeKey="name"
              excludeValue="Szablon"
              {...listProps}
            />
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
