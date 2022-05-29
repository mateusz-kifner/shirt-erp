import {
  Button,
  Group,
  InputWrapper,
  Modal,
  SimpleGrid,
  Stack,
} from "@mantine/core"
import { useUuid } from "@mantine/hooks"
import { FC, useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { iconState } from "../../atoms/iconState"
import { X } from "../../utils/TablerIcons"
import ApiIconSVG from "../api/ApiIconSVG"

interface DetailsApiIconIdProps {
  label?: string
  value?: number
  initialValue?: number
  onSubmit?: (value: number | null) => void
  disabled?: boolean
  required?: boolean
  entryName?: string
}

const DetailsApiIconId: FC<DetailsApiIconIdProps> = ({
  label,
  value,
  initialValue,

  onSubmit,
  disabled,
  required,
  entryName,
}) => {
  const [opened, setOpened] = useState(false)
  const [iconId, setIconId] = useState<number | null>(
    value ? value : initialValue ? initialValue : null
  )
  const iconsData = useRecoilValue(iconState)
  const uuid = useUuid()

  useEffect(() => {
    value && setIconId(value)
  }, [value])

  if (!entryName) return null

  return (
    <InputWrapper
      label={label && label.length > 0 ? label : undefined}
      required={required}
    >
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Wybierz ikonę"
        centered
      >
        <SimpleGrid cols={3}>
          {iconsData &&
            iconsData[entryName].map((val: { id: number }) => (
              <Button
                variant="default"
                styles={{
                  root: {
                    width: 120,
                    height: 120,
                  },
                }}
                px="xs"
                onClick={() => {
                  onSubmit && onSubmit(val.id)
                  setIconId(val.id)
                  setOpened(false)
                }}
                key={uuid + val.id}
              >
                <ApiIconSVG entryName={entryName} id={val.id} size={96} />
              </Button>
            ))}
          <Button
            variant="default"
            styles={{
              root: {
                width: 120,
                height: 120,
              },
            }}
            px="xs"
            onClick={() => {
              onSubmit && onSubmit(null)
              setIconId(null)
              setOpened(false)
            }}
            key={uuid + "null"}
          >
            <X size={96} />
          </Button>
        </SimpleGrid>
      </Modal>
      <Stack>
        <Group>
          <Button
            variant="default"
            size="xl"
            px="xs"
            onClick={() => setOpened(true)}
            disabled={disabled}
          >
            <ApiIconSVG entryName={entryName} size={48} id={iconId} />
          </Button>
        </Group>
      </Stack>
    </InputWrapper>
  )
}

export default DetailsApiIconId
