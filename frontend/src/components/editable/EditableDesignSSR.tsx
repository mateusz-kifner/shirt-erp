import {
  ActionIcon,
  Button,
  Group,
  Input,
  Stack,
  Tooltip,
  useMantineTheme,
} from "@mantine/core"
import { useListState } from "@mantine/hooks"
import React, { useState } from "react"
import { Category, Shirt, Wallpaper } from "tabler-icons-react"
import { env } from "../../env/client.mjs"
import { SxBackground } from "../../styles/basic"
import { FileType } from "../../types/FileType"

interface EditableDesignProps {
  label?: string
  value?: any
  initialValue?: any
  onSubmit?: (value: any | null) => void
  disabled?: boolean
  required?: boolean
  files?: FileType[]
}

const EditableDesign = (props: EditableDesignProps) => {
  const { label, value, initialValue, onSubmit, disabled, required, files } =
    props
  const [fullscreen, setFullscreen] = useState<boolean>(false)
  const theme = useMantineTheme()

  const [images, imagesHandlers] = useListState<FileType>([])

  return (
    <Input.Wrapper label={label}>
      <Stack
        spacing={0}
        style={
          fullscreen
            ? {
                position: "absolute",
                top: 0,
                left: 0,
                // bottom: 0,
                right: 0,
                zIndex: 9999,
                height: "200vh",
                background: theme.colorScheme === "dark" ? "#000" : "#fff",
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
          <Button.Group p={0}>
            <Tooltip label={""} m={0} withinPortal openDelay={500}>
              <Button
                variant="default"
                p={0}
                size="xs"
                style={
                  {
                    // backgroundColor:
                    //   getRandomColorByNumber(metadata[key].id) +
                    //   "88",
                  }
                }
                onClick={() => {}}
              >
                <Category />
              </Button>
            </Tooltip>
            <Tooltip label={""} m={0} withinPortal openDelay={500}>
              <Button
                variant="default"
                p={0}
                size="xs"
                style={
                  {
                    // backgroundColor:
                    //   getRandomColorByNumber(metadata[key].id) +
                    //   "88",
                  }
                }
                onClick={() => {}}
              >
                <Shirt />
              </Button>
            </Tooltip>
            <Tooltip label={""} m={0} withinPortal openDelay={500}>
              <Button
                variant="default"
                p={0}
                size="xs"
                style={
                  {
                    // backgroundColor:
                    //   getRandomColorByNumber(metadata[key].id) +
                    //   "88",
                  }
                }
                onClick={() => {}}
              >
                <Wallpaper />
              </Button>
            </Tooltip>
          </Button.Group>
        </Group>
      </Stack>
      <div>Design editor</div>
      {images.map((imageData, index) => (
        <img
          src={
            env.NEXT_PUBLIC_SERVER_API_URL +
            imageData.url +
            "?token=" +
            imageData.token
          }
        ></img>
      ))}
    </Input.Wrapper>
  )
}

export default EditableDesign
