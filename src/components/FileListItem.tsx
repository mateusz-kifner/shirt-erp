import { IconDownload, IconEye } from "@tabler/icons-react";
import Link from "next/link";
import { type CSSProperties, type ReactNode } from "react";

import { type File } from "@/server/api/file/validator";
import { cn } from "@/utils/cn";
import Button, { buttonVariants } from "./ui/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "./ui/ContextMenu";

interface FileListItemProps {
  onChange?: (file: Partial<File>) => void;
  value: Partial<File>;
  active?: boolean;
  disabled?: boolean;
  onPreview?: (
    url: string,
    width?: number | null,
    height?: number | null,
  ) => void;
  style?: CSSProperties;
  contextMenuContent?: ReactNode;
  disableDownload?: boolean;
  draggable?: boolean;
}

const FileListItem = (props: FileListItemProps) => {
  const {
    value,
    onPreview,
    style,
    contextMenuContent,
    disableDownload,
    draggable,
  } = props;

  // const t = useTranslation();

  const preview = value.mimetype?.startsWith("image")
    ? `/api/files/${value.filename}${
        value?.token && value.token.length > 0 ? "?token=" + value?.token : ""
      }`
    : undefined;

  return (
    <ContextMenu>
      <ContextMenuTrigger
        draggable={draggable}
        onDragStart={(e) => {
          // console.log(e);
          const jsonData = JSON.stringify(value);
          e.dataTransfer.setData("application/json", jsonData);
        }}
        style={style}
        className="relative flex items-center gap-2 overflow-hidden border-l border-r border-t border-solid border-input bg-background first:rounded-t last:rounded-b last:border-b"
      >
        <div className="relative h-[100px] w-[100px] min-w-[100px] overflow-hidden  child-hover:visible">
          <img
            src={preview ?? "/assets/unknown_file.svg"}
            alt=""
            width={100}
            height={100}
            className="h-[100px] w-[100px]  border-b-0 border-l-0 border-r border-t-0 border-input object-cover "
          />

          {preview && onPreview && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-0 top-0 z-10 h-full w-full rounded-none border-b-0 border-l-0 border-t-0 hover:bg-black hover:bg-opacity-20"
              onClick={() => {
                value?.filename &&
                  onPreview(
                    "/api/files/" +
                      value.filename +
                      (value?.token && value.token.length > 0
                        ? "?token=" + value?.token
                        : ""),
                    value?.width,
                    value?.height,
                  );
              }}
            >
              <IconEye
                className="text-stone-300 dark:text-stone-600"
                size={26}
              />
            </Button>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-[calc(100% - 180px)] mr-20 max-h-[90px] break-all">
              {value?.originalFilename}
            </div>
          </TooltipTrigger>
          {!(
            value?.originalFilename && value?.originalFilename?.length < 40
          ) && (
            <TooltipContent className="w-80 whitespace-normal break-all dark:whitespace-normal">
              {value?.originalFilename}
            </TooltipContent>
          )}
        </Tooltip>

        {!disableDownload && (
          <Link
            href={`/api/files/${value?.filename}${
              value?.token && value.token.length > 0
                ? "?token=" + value?.token + "&download"
                : "?download"
            }`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              `absolute 
            -right-12
            top-1/2
            h-32
            w-32
            -translate-y-1/2
            rounded-full
            hover:bg-black/15
            dark:hover:bg-white/10`,
            )}
          >
            <IconDownload size={26} />
            <div style={{ width: "2.4rem" }}></div>
          </Link>
        )}

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
      </ContextMenuTrigger>
      <ContextMenuContent
        className="flex min-w-[220px] flex-col gap-2 overflow-hidden rounded-md bg-white p-[5px] dark:bg-stone-950"
        // sideOffset={5}
        // align="end"
      >
        {contextMenuContent}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default FileListItem;
