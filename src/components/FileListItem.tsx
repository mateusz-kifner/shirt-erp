import useTranslation from "@/hooks/useTranslation";
import { type FileType } from "@/schema/fileSchema";
import * as RadixContextMenu from "@radix-ui/react-context-menu";
import { IconDownload, IconEye } from "@tabler/icons-react";
import Link from "next/link";
import { type CSSProperties, type ReactNode } from "react";
import ActionButton from "./ui/ActionButton";
import Tooltip from "./ui/Tooltip";

interface FileListItemProps {
  onChange?: (file: Partial<FileType>) => void;
  value: Partial<FileType>;
  active?: boolean;
  disabled?: boolean;
  onPreview?: (
    url: string,
    width?: number | null,
    height?: number | null
  ) => void;
  style?: CSSProperties;
  contextMenuContent?: ReactNode;
}

const FileListItem = (props: FileListItemProps) => {
  const {
    value,
    onChange,
    active,
    disabled,
    onPreview,
    style,
    contextMenuContent,
  } = props;
  const t = useTranslation();

  const preview = value.mimetype?.startsWith("image")
    ? `/api/files/${value.filename}${
        value?.token && value.token.length > 0 ? "?token=" + value?.token : ""
      }`
    : undefined;

  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger
        style={style}
        className="relative flex items-center gap-2 overflow-hidden border-l border-r border-t border-solid border-gray-400 first:rounded-t last:rounded-b last:border-b dark:border-stone-600"
      >
        <div className="relative h-[100px] w-[100px] min-w-[100px] overflow-hidden  child-hover:visible">
          <img
            src={preview ?? "/assets/unknown_file.svg"}
            alt=""
            width={100}
            height={100}
            className="h-[100px] w-[100px]  border-none border-gray-400 object-cover dark:border-stone-600"
          />

          {preview && onPreview && (
            <ActionButton
              className="absolute left-0 top-0 z-50 h-full w-full hover:bg-black hover:bg-opacity-20"
              onClick={() => {
                value?.filename &&
                  onPreview(
                    "/api/files/" +
                      value.filename +
                      (value?.token && value.token.length > 0
                        ? "?token=" + value?.token
                        : ""),
                    value?.width,
                    value?.height
                  );
              }}
            >
              <IconEye
                className="text-stone-300 dark:text-stone-600"
                size={26}
              />
            </ActionButton>
          )}
        </div>
        <Tooltip
          tooltip={value?.originalFilename}
          delayDuration={1000}
          // multiline
          // width={400}
          // style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
          // withArrow
          // openDelay={500}
          disabled={
            !!(value?.originalFilename && value?.originalFilename?.length < 40)
          }
        >
          <div className="max-w-[calc(100% - 180px)] max-h-[90px] flex-grow break-words pr-2">
            {value?.originalFilename}
          </div>
        </Tooltip>

        <Link
          href={`/api/files/${value?.filename}${
            value?.token && value.token.length > 0
              ? "?token=" + value?.token + "&download"
              : "?download"
          }`}
          className="action-button
            absolute 
            -right-12
            top-1/2
            h-32
            w-32
            -translate-y-1/2
            rounded-full
            bg-white
            before:absolute
            before:inset-0
            before:-z-10
            before:rounded-full
            hover:bg-white
            hover:before:bg-black
            hover:before:bg-opacity-20
            dark:bg-stone-800
            dark:hover:bg-stone-800
            "
        >
          <IconDownload size={26} />
          <div style={{ width: "2.4rem" }}></div>
        </Link>

        {/* <div
        style={{
          display: menuData.opened ? "block" : "none",
          position: "absolute",
          top: menuData.y,
          left: menuData.x,
        }}
        ref={clickOutsideRef}
      >
        {menuNode}
      </div> */}
      </RadixContextMenu.Trigger>
      <RadixContextMenu.Portal>
        <RadixContextMenu.Content
          className="flex min-w-[220px] flex-col gap-2 overflow-hidden rounded-md bg-white p-[5px] dark:bg-stone-950"
          // sideOffset={5}
          // align="end"
        >
          {contextMenuContent}
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
};

export default FileListItem;
