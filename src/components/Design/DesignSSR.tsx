import { useUserContext } from "@/context/userContext";
import useTranslation from "@/hooks/useTranslation";
import type EditableInput from "@/schema/EditableInput";
import { useListState } from "@mantine/hooks";
import { SVG } from "@svgdotjs/svg.js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import TablerIconType from "@/schema/TablerIconType";
import { cn } from "@/utils/cn";
import { isMimeImage } from "@/utils/isMimeImage";
import {
  IconCategory,
  IconColorSwatch,
  IconGridPattern,
  IconScreenShare,
  IconSquareNumber1,
  IconSquareNumber2,
  IconSquareNumber3,
} from "@tabler/icons-react";
import {
  ChangeEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from "react";
import FileListItem from "../FileListItem";
import EditableColor from "../editable/EditableColor";
import { Label } from "../ui/Label";
import DesignImage from "./DesignImage";
import { File } from "@/db/schema/files";

const colorPickerSwatches = [
  "#000e1c",
  "#ce102c",
  "#002a3a",
  "#194E90",
  "#7E7B50",
  "#007398",
  "#AC9768",
  "#3B8DDF",
  "#DB5204",
  "#294634",
  "#845D32",
  "#512B3A",
  "#5D3225",
  "#A8353A",
  "#343E48",
  "#B42574",
  "#303030",
  "#D0E1D9",
  "#018657",
  "#4F4A34",
  "#77BC21",
  "#D5BA8D",
  "#C3A0D8",
  "#F0E87D",
  "#FF681F",
  "#FFA401",
  "#F8DBE0",
  "#ECED6E",
  "#2F1A45",
  "#AF0061",
  "#E2B87E",
  "#97D5EA",
  "#FFCD0E",
  "#FF8041",
  "#00A6B6",
  "#F52837",
  "#888A8E",
  "#F54D80",
  "#42201F",
  "#F6DC6D",
  "#FFBFA1",
  "#FFB1C1",
  "#BADCE6",
  "#FFB81E",
  "#96E3C1",
  "#c19473",
  "#426D8C",
  "#555555",
  "#ffffff",
  "#25262b",
  "#868e96",
  "#fa5252",
  "#e64980",
  "#be4bdb",
  "#7950f2",
  "#4c6ef5",
  "#228be6",
  "#15aabf",
  "#12b886",
  "#40c057",
  "#82c91e",
  "#fab005",
  "#fd7e14",
];

export type DesignBackgroundsType = {
  name: string;
  icon: TablerIconType;
  images: {
    name: string;
    image?: Partial<File>;
    mask?: Partial<File>;
  }[];
}[];

interface DesignProps extends EditableInput<any> {
  files?: File[];
  backgrounds: DesignBackgroundsType;
  id?: number;
}

const Design = (props: DesignProps) => {
  const {
    label,
    value,
    onSubmit,
    disabled,
    required,
    files,
    backgrounds: externalBackgrounds = [],
  } = props;
  const t = useTranslation();
  const { debug } = useUserContext();
  const backgrounds: DesignBackgroundsType = [
    ...externalBackgrounds,
    {
      name: "empty x1",
      icon: IconSquareNumber1,
      images: [
        {
          name: "empty1",
        },
      ],
    },
    {
      name: "empty x2",
      icon: IconSquareNumber2,
      images: [
        {
          name: "empty1",
        },
        {
          name: "empty2",
        },
      ],
    },
    {
      name: "empty x3",
      icon: IconSquareNumber3,
      images: [
        {
          name: "empty1",
        },
        {
          name: "empty2",
        },
        {
          name: "empty3",
        },
      ],
    },
  ];
  const uuid = useId();
  const SVGWrapperRefElement = useRef<HTMLDivElement>(null);
  const SVGContainer = useMemo(() => SVG(), []);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [backgroundColor, setBackgroundColor] = useState<string>("#eeeeee");
  const [itemColor, setItemColor] = useState<string>("#222222");
  const [backgroundId, setBackgroundId] = useState<number>(0);
  const [backgroundImageId, setBackgroundImageId] = useState<number>(0);
  const [dragActive, setDragActive] = useState(false);
  const [activeImage, setActiveImage] = useState<number | null>(null);

  const [images, imagesHandlers] = useListState<File>([]);

  const backgroundImage =
    backgrounds?.[backgroundId]?.images?.[backgroundImageId]?.image;

  const draw = () => {
    SVGContainer.add(SVG().rect(100, 100).fill("#f06"));
  };

  const clear = () => {
    SVGContainer.clear();
  };

  useEffect(() => {
    if (files && files[2]) imagesHandlers.setState([files[2]]);
  }, []);

  useEffect(() => {
    if (
      SVGWrapperRefElement &&
      SVGWrapperRefElement?.current &&
      SVGWrapperRefElement?.current?.children.length < 1
    ) {
      SVGContainer.addTo(SVGWrapperRefElement?.current);
    }
  }, [SVGWrapperRefElement, SVGContainer]);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e.dataTransfer);
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      // onUploadMany(Array.from(e.target.files));
      console.log("files handleChange", Array.from(e.target.files));
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.dataTransfer);
    const data = e.dataTransfer.getData("application/json");
    try {
      const obj = JSON.parse(data);
      imagesHandlers.append(obj as File);
      console.log(obj);
    } catch (e) {
      console.log(e);
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // onUploadMany(Array.from(e.dataTransfer.files));
      try {
        setDragActive(false);

        e.dataTransfer.clearData();
      } catch (error) {
        // already handled
      }
    }
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col gap-2 p-2",
        fullscreen &&
          "absolute inset-0 z-[99999] h-[200vh] overflow-hidden bg-white dark:bg-black",
      )}
    >
      <div
        // py="xs"
        // align="end"
        // position="apart"
        // sx={fullscreen ? SxBackground : undefined}
        style={{ display: disabled ? "none" : undefined }}
        className="Spreadsheet__controls flex items-end justify-end gap-2"
      >
        <div className="flex items-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setShowGrid((val) => !val)}
              >
                <IconGridPattern />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t.grid}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline">
                    <IconCategory />
                  </Button>
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {backgrounds.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <DropdownMenuItem
                      key={`${uuid}itemsMenu:${index}`}
                      // icon={<Icon />}
                      onClick={() => setBackgroundId(index)}
                    >
                      <Icon />
                      {value.name}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent side="bottom">{t.item}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    style={{ background: backgroundColor }}
                  >
                    <IconColorSwatch fill={itemColor} />
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-2">
                <div>
                  {t.item_color}
                  <EditableColor
                    value={itemColor}
                    onSubmit={(value) => {
                      value && setItemColor(value);
                    }}
                  />
                </div>
                <div>
                  {t.background_color}
                  <EditableColor
                    value={backgroundColor}
                    onSubmit={(value) => {
                      value && setBackgroundColor(value);
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent side="bottom">{t.item_color}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  setFullscreen((fullscreen) => !fullscreen);
                }}
              >
                <IconScreenShare />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t.fullscreen}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col items-start gap-4">
          {backgrounds?.[backgroundId]?.images.map(
            ({ image, mask, name }, bgImageIndex) => {
              const width = image?.width ?? 800;
              const height = image?.height ?? 800;
              const maskUrl = mask?.url;
              const imageUrl = image?.url;
              return (
                <div
                  key={uuid + "bg" + bgImageIndex}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-solid border-transparent",
                    dragActive && "border-sky-600",
                  )}
                >
                  {/* <div>{name}</div> */}
                  <div
                    style={{
                      position: "relative",
                      width: width,
                      height: height,
                    }}
                  >
                    <div
                      className="absolute left-0 top-0"
                      style={{
                        backgroundColor: backgroundColor,
                        width: width,
                        height: height,
                        border: "1px solid rgb(128,128,128)",
                      }}
                    ></div>

                    <div
                      className="absolute left-0 top-0"
                      style={{
                        backgroundImage: image?.url
                          ? `url('${imageUrl}')`
                          : undefined,
                        width: width,
                        height: height,
                        backgroundSize: `${width}px ${height}px`,
                      }}
                    >
                      <div
                        className="absolute left-0 top-0 h-full w-full"
                        style={{
                          maskImage: mask?.url
                            ? `url('${maskUrl}')`
                            : undefined,
                          maskSize: `${width}px ${height}px`,
                          WebkitMaskSize: `${width}px ${height}px`,
                          WebkitMaskImage: mask?.url
                            ? `url('${maskUrl}')`
                            : undefined,

                          backgroundColor: mask?.url ? itemColor : undefined,
                          mixBlendMode: "multiply",
                        }}
                      ></div>
                    </div>
                    {showGrid && (
                      <div
                        className="absolute left-0 top-0 "
                        style={{
                          backgroundImage: `url('/assets/grid.svg')`,
                          width: width,
                          height: height,
                          backgroundSize: `${width / 2}px ${height / 2}px`,
                        }}
                      ></div>
                    )}
                    <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
                      {images.map((imageData, index) => (
                        <DesignImage
                          file={imageData}
                          key={`${uuid}:img:${index}`}
                          onActive={(active) => active && setActiveImage(index)}
                          active={activeImage === index}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
        <Tabs defaultValue="files" className="flex flex-grow flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="files" className=" first-letter:uppercase">
              {t.file.plural}
            </TabsTrigger>
            <TabsTrigger value="properties">{t.properties}</TabsTrigger>
          </TabsList>
          <TabsContent value="files">
            {files &&
              files?.map((val, index) => {
                const url = val.mimetype?.startsWith("image")
                  ? `/api/files/${val.filename}${
                      val?.token && val.token.length > 0
                        ? "?token=" + val?.token
                        : ""
                    }`
                  : undefined;
                return isMimeImage(val?.mimetype ?? "") ? (
                  <FileListItem
                    value={val}
                    disableDownload
                    draggable
                    key={`${uuid}:files:${index}`}
                  />
                ) : null;
              })}
          </TabsContent>
          <TabsContent value="properties" className="flex flex-col gap-2">
            {activeImage !== null ? (
              <>
                <div>{images[activeImage]?.filename}</div>
                <div className="grid w-full grid-cols-2 gap-2">
                  <div>
                    <Label
                      htmlFor={`${uuid}:properties:width`}
                      label={t.width}
                    />
                    <Input id={`${uuid}:properties:width`} />
                  </div>
                  <div>
                    <Label
                      htmlFor={`${uuid}:properties:height`}
                      label={t.height}
                    />
                    <Input id={`${uuid}:properties:height`} />
                  </div>
                </div>
              </>
            ) : (
              <div>Select image</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Design;
