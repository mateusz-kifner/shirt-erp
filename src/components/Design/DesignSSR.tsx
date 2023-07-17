import { useUserContext } from "@/context/userContext";
import useTranslation from "@/hooks/useTranslation";
import type EditableInput from "@/schema/EditableInput";
import { type FileType } from "@/schema/fileSchema";
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
import { Label } from "@/components/ui/Label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import {
  IconCategory,
  IconColorSwatch,
  IconGridPattern,
  IconScreenShare,
  IconSquareNumber1,
  IconSquareNumber2,
  IconSquareNumber3,
  IconWallpaper,
} from "@tabler/icons-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";

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
  icon: ComponentType<any & { size?: number }>;
  images: {
    name: string;
    image?: Partial<FileType>;
    mask?: Partial<FileType>;
  }[];
}[];

interface EditableDesignProps extends EditableInput<any> {
  files?: FileType[];
  backgrounds: DesignBackgroundsType;
}

const EditableDesign = (props: EditableDesignProps) => {
  const {
    label,
    value,
    onSubmit,
    disabled,
    required,
    files,
    backgrounds: externalBackgrounds,
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

  const [images, imagesHandlers] = useListState<FileType>([]);

  const backgroundImage =
    backgrounds?.[backgroundId]?.images?.[backgroundImageId]?.image;

  const draw = () => {
    SVGContainer.add(SVG().rect(100, 100).fill("#f06"));
  };

  const clear = () => {
    SVGContainer.clear();
  };

  useEffect(() => {
    if (
      SVGWrapperRefElement &&
      SVGWrapperRefElement?.current &&
      SVGWrapperRefElement?.current?.children.length < 1
    ) {
      SVGContainer.addTo(SVGWrapperRefElement?.current);
    }
  }, [SVGWrapperRefElement, SVGContainer]);

  return (
    <>
      <Label />
      <div
        className={
          fullscreen
            ? "absolute inset-0 z-[99999] h-[200vh] overflow-hidden bg-white dark:bg-black"
            : "h-full"
        }
      >
        <div
          // py="xs"
          // align="end"
          // position="apart"
          // sx={fullscreen ? SxBackground : undefined}
          style={{ display: disabled ? "none" : undefined }}
          className="Spreadsheet__controls flex items-end py-4 "
        >
          <div className="flex items-end gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => setShowGrid((val) => !val)}>
                  <IconGridPattern />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t.grid}</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button>
                      <IconCategory />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t.item}</TooltipContent>
                </Tooltip>
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
            </DropdownMenu>{" "}
            <Popover>
              <PopoverTrigger>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button>
                      <IconWallpaper fill={backgroundColor} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t.background_color}</TooltipContent>
                </Tooltip>
              </PopoverTrigger>
              <PopoverContent>
                {t.background_color}
                {/* <ColorPicker
                    swatchesPerRow={7}
                    format="rgba"
                    swatches={colorPickerSwatches}
                    value={backgroundColor}
                    onChange={setBackgroundColor}
                  /> */}
                <Input
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button>
                      <IconColorSwatch fill={itemColor} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t.item_color}</TooltipContent>
                </Tooltip>
              </PopoverTrigger>
              <PopoverContent>
                {t.item_color}
                {/* <ColorPicker
                    swatchesPerRow={7}
                    format="rgba"
                    swatches={colorPickerSwatches}
                    value={itemColor}
                    onChange={setItemColor}
                  /> */}
                <Input
                  value={itemColor}
                  onChange={(e) => setItemColor(e.target.value)}
                />
              </PopoverContent>
            </Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    setFullscreen((fullscreen) => !fullscreen);
                  }}
                >
                  <IconScreenShare />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t.fullscreen}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex gap-2">
          {backgrounds?.[backgroundId]?.images.map(
            ({ image, mask }, bgImageIndex) => {
              const width = image?.width ?? 800;
              const height = image?.height ?? 800;
              const maskUrl = mask?.url;
              const imageUrl = image?.url;
              return (
                <div
                  key={uuid + "bg" + bgImageIndex}
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
                        maskImage: mask?.url ? `url('${maskUrl}')` : undefined,
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

                  {images.map((imageData, index) => (
                    <img
                      className="absolute left-0 top-0"
                      key={uuid + "bg" + bgImageIndex + "image" + index}
                      src={`${imageData?.url}?token=${imageData.token}`}
                    />
                  ))}
                </div>
              );
            }
          )}
        </div>
      </div>
    </>
  );
};

export default EditableDesign;
