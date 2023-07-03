import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { useId } from "@mantine/hooks";
import { IconExternalLink, IconTrashX } from "@tabler/icons-react";
import { capitalize, isEqual } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import useTranslation from "@/hooks/useTranslation";

import type EditableInput from "@/types/EditableInput";
import ApiList from "../ApiList";
import InputLabel from "../input/InputLabel";

interface EditableApiEntryProps extends EditableInput<any> {
  entryName: string;
  Element: React.ElementType;
  copyProvider?: (value: any | null) => string | undefined;
  style?: CSSProperties;
  withErase?: boolean;
  listProps?: any;
  linkEntry?: boolean;
  helpTooltip?: string;
  allowClear?: boolean;
}

const EditableApiEntry = (props: EditableApiEntryProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    Element,
    entryName,
    copyProvider = () => "",
    style,
    withErase = false,
    listProps,
    linkEntry = true,
    helpTooltip,
    allowClear = false,
  } = props;

  const [apiEntry, setApiEntry] = useState<any>(value ?? initialValue ?? null);
  const [prev, setPrev] = useState<any>(apiEntry);
  const [open, setOpen] = useState<boolean>(false);
  const uuid = useId();
  // eslint-disable-next-line
  const copyValue = useMemo(() => copyProvider(apiEntry), [apiEntry]);
  const router = useRouter();
  const t = useTranslation();

  useEffect(() => {
    setApiEntry(value);
    setPrev(value);
  }, [value]);

  useEffect(() => {
    if (isEqual(apiEntry, prev)) return;
    onSubmit?.(apiEntry);
    setPrev(apiEntry);
    // eslint-disable-next-line
  }, [apiEntry]);

  return (
    <div>
      <InputLabel
        label={label}
        copyValue={apiEntry && copyValue ? copyValue : ""}
        required={required}
        helpTooltip={helpTooltip}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        contentProps={{
          className: "w-[30rem] max-w-screen min-h-[50rem] max-h-screen",
        }}
      >
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
                ? capitalize(
                    (
                      t[entryName as keyof typeof t] as {
                        singular: string;
                        plural: string;
                      }
                    )?.plural
                  )
                : undefined
            }
            onChange={(value) => {
              setOpen(false);
              setApiEntry(value);
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
      </Modal>
      {entryName ? (
        <div
          key={uuid}
          className={` relative flex overflow-hidden rounded border border-solid border-transparent ${
            open
              ? "border-sky-600 dark:border-sky-600"
              : "border-gray-400 dark:border-stone-600"
          }`}
        >
          <Element
            onChange={() => setOpen(true)}
            value={apiEntry}
            disabled={disabled}
          />
          {linkEntry && value && value?.id && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Link
                href={`/erp/${entryName}/${value?.id as string}`}
                className="action-button"
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
    </div>
  );
};

export default EditableApiEntry;
