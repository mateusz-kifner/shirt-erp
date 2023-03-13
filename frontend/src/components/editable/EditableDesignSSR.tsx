import {
  Button,
  ColorPicker,
  Group,
  Input,
  Menu,
  Overlay,
  Popover,
  Stack,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
  Text,
} from "@mantine/core"
import { useListState } from "@mantine/hooks"
import { SVG } from "@svgdotjs/svg.js"
import React, {
  ComponentType,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  IconCategory,
  IconColorSwatch,
  IconGardenCart,
  IconGridPattern,
  IconScreenShare,
  IconSquareNumber1,
  IconSquareNumber2,
  IconSquareNumber3,
  IconWallpaper,
} from "@tabler/icons-react"
import { useAuthContext } from "../../context/authContext"
import { env } from "../../env/client.mjs"
import { useTranslation } from "../../i18n"
import { SxBackground } from "../../styles/basic"
import EditableInput from "../../types/EditableInput"
import { FileType } from "../../types/FileType"

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
]

export type DesignBackgroundsType = {
  name: string
  icon: ComponentType<any & { size?: number }>
  images: {
    name: string
    image?: Partial<FileType>
    mask?: Partial<FileType>
  }[]
}[]

interface EditableDesignProps extends EditableInput<any> {
  files?: FileType[]
  backgrounds: DesignBackgroundsType
}

const EditableDesign = (props: EditableDesignProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    files,
    backgrounds: externalBackgrounds,
  } = props
  const { t } = useTranslation()
  const { debug } = useAuthContext()
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
  ]
  const uuid = useId()
  const SVGWrapperRefElement = useRef<HTMLDivElement>(null)
  const SVGContainer = useMemo(() => SVG(), [])
  const [fullscreen, setFullscreen] = useState<boolean>(false)
  const [showGrid, setShowGrid] = useState<boolean>(true)
  const [backgroundColor, setBackgroundColor] = useState<string>("#eeeeee")
  const [itemColor, setItemColor] = useState<string>("#222222")
  const [backgroundId, setBackgroundId] = useState<number>(0)
  const [backgroundImageId, setBackgroundImageId] = useState<number>(0)

  const theme = useMantineTheme()

  const [images, imagesHandlers] = useListState<FileType>([])

  const backgroundImage =
    backgrounds[backgroundId].images[backgroundImageId].image

  const draw = () => {
    SVGContainer.add(SVG().rect(100, 100).fill("#f06"))
  }

  const clear = () => {
    SVGContainer.clear()
  }

  useEffect(() => {
    if (
      SVGWrapperRefElement &&
      SVGWrapperRefElement?.current &&
      SVGWrapperRefElement?.current?.children.length < 1
    ) {
      SVGContainer.addTo(SVGWrapperRefElement?.current)
    }
  }, [SVGWrapperRefElement, SVGContainer])

  return (
    <Input.Wrapper label={label} style={!debug ? { position: "relative" } : {}}>
      {!debug && (
        <Overlay color="#333" opacity={0.9} style={{ zIndex: 40 }}>
          <Group p={60}>
            <IconGardenCart size={32} />
            <Title order={3}>Design niedostępny</Title>
          </Group>
          <Group pl={60}>
            <Text>W trakcie tworzenia</Text>
          </Group>
        </Overlay>
      )}
      <Stack
        spacing={0}
        style={
          fullscreen
            ? {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                height: "200vh",
                backgroundColor: theme.colorScheme === "dark" ? "#000" : "#fff",
                overflow: "hidden",
              }
            : { height: "100%" }
        }
      >
        <Group
          py="xs"
          align="end"
          position="apart"
          sx={fullscreen ? SxBackground : undefined}
          style={{ display: disabled ? "none" : undefined }}
          className="Spreadsheet__controls"
        >
          <div></div>
          <Group p={0} align="end">
            <Button.Group p={0}>
              <Tooltip label={t("grid")} m={0} withinPortal openDelay={500}>
                <Button
                  variant="default"
                  p={0}
                  size="xs"
                  onClick={() => setShowGrid((val) => !val)}
                >
                  <IconGridPattern />
                </Button>
              </Tooltip>
              <Menu withinPortal>
                <Menu.Target>
                  <Tooltip label={t("item")} m={0} withinPortal openDelay={500}>
                    <Button variant="default" p={0} size="xs">
                      <IconCategory />
                    </Button>
                  </Tooltip>
                </Menu.Target>
                <Menu.Dropdown>
                  {backgrounds.map((value, index) => {
                    const Icon = value.icon
                    return (
                      <Menu.Item
                        key={uuid + "itemsMenu" + index}
                        icon={<Icon />}
                        onClick={() => setBackgroundId(index)}
                      >
                        {value.name}
                      </Menu.Item>
                    )
                  })}
                </Menu.Dropdown>
              </Menu>{" "}
              <Popover position="bottom" withArrow shadow="md" withinPortal>
                <Popover.Target>
                  <Tooltip
                    label={t("background color")}
                    m={0}
                    withinPortal
                    openDelay={500}
                  >
                    <Button variant="default" p={0} size="xs">
                      <IconWallpaper fill={backgroundColor} />
                    </Button>
                  </Tooltip>
                </Popover.Target>
                <Popover.Dropdown>
                  {t("background color")}
                  <ColorPicker
                    swatchesPerRow={7}
                    format="rgba"
                    swatches={colorPickerSwatches}
                    value={backgroundColor}
                    onChange={setBackgroundColor}
                  />
                  <TextInput
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                  />
                </Popover.Dropdown>
              </Popover>
              <Popover position="bottom" withArrow shadow="md" withinPortal>
                <Popover.Target>
                  <Tooltip
                    label={t("item color")}
                    m={0}
                    withinPortal
                    openDelay={500}
                  >
                    <Button variant="default" p={0} size="xs">
                      <IconColorSwatch fill={itemColor} />
                    </Button>
                  </Tooltip>
                </Popover.Target>
                <Popover.Dropdown>
                  {t("item color")}
                  <ColorPicker
                    swatchesPerRow={7}
                    format="rgba"
                    swatches={colorPickerSwatches}
                    value={itemColor}
                    onChange={setItemColor}
                  />
                  <TextInput
                    value={itemColor}
                    onChange={(e) => setItemColor(e.target.value)}
                  />
                </Popover.Dropdown>
              </Popover>
            </Button.Group>

            <Tooltip label={t("fullscreen") as string}>
              <Button
                variant="default"
                p={0}
                size="xs"
                onClick={() => {
                  setFullscreen((fullscreen) => !fullscreen)
                }}
              >
                <IconScreenShare />
              </Button>
            </Tooltip>
          </Group>
        </Group>

        <Group>
          {backgrounds[backgroundId].images.map(
            ({ image, mask }, bgImageIndex) => {
              const width = image?.width ?? 800
              const height = image?.height ?? 800
              const maskUrl = "" + env.NEXT_PUBLIC_SERVER_API_URL + mask?.url
              const imageUrl = "" + env.NEXT_PUBLIC_SERVER_API_URL + image?.url
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
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      backgroundColor: backgroundColor,
                      width: width,
                      height: height,
                      border: "1px solid rgb(128,128,128)",
                    }}
                  ></div>

                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      backgroundImage: image?.url
                        ? `url('${imageUrl}')`
                        : undefined,
                      width: width,
                      height: height,
                      backgroundSize: `${width}px ${height}px`,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        maskImage: mask?.url ? `url('${maskUrl}')` : undefined,
                        maskSize: `${width}px ${height}px`,
                        WebkitMaskSize: `${width}px ${height}px`,
                        WebkitMaskImage: mask?.url
                          ? `url('${maskUrl}')`
                          : undefined,

                        backgroundColor: mask?.url ? itemColor : undefined,
                        width: "100%",
                        height: "100%",
                        mixBlendMode: "multiply",
                      }}
                    ></div>
                  </div>
                  {showGrid && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        backgroundImage: `url('${
                          "" +
                          env.NEXT_PUBLIC_SERVER_API_URL +
                          "/assets/grid.svg"
                        }')`,
                        width: width,
                        height: height,
                        backgroundSize: `${width / 2}px ${height / 2}px`,
                      }}
                    ></div>
                  )}

                  {images.map((imageData, index) => (
                    <img
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                      key={uuid + "bg" + bgImageIndex + "image" + index}
                      src={
                        env.NEXT_PUBLIC_SERVER_API_URL +
                        imageData.url +
                        "?token=" +
                        imageData.token
                      }
                    ></img>
                  ))}
                </div>
              )
            }
          )}
        </Group>
      </Stack>
    </Input.Wrapper>
  )
}

export default EditableDesign
