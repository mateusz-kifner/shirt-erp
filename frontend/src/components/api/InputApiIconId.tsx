import {
  Button,
  Group,
  InputWrapper,
  Modal,
  SimpleGrid,
  Stack,
  UnstyledButton,
} from "@mantine/core"
import { FC, useState } from "react"
import { useRecoilValue } from "recoil"
import { iconState } from "../../atoms/iconState"
import ApiIconSVG from "./ApiIconSVG"

interface InputApiIconIdProps {
  label?: string
  placeholder?: string
  value?: number
  onChange?: (value: number | null) => void
  disabled?: boolean
  required?: boolean
  entryName?: string
}

const InputApiIconId: FC<InputApiIconIdProps> = ({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  required,
  entryName,
}) => {
  const [opened, setOpened] = useState(false)
  const [iconId, setIconId] = useState<number>()
  const iconsData = useRecoilValue(iconState)

  if (!entryName) return null

  return (
    <InputWrapper label={label}>
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
                  setIconId(val.id)
                  setOpened(false)
                }}
              >
                <ApiIconSVG entryName={entryName} id={val.id} size={96} />
              </Button>
            ))}
        </SimpleGrid>
      </Modal>
      <Stack>
        <Group>
          <Button
            variant="default"
            size="xl"
            px="xs"
            onClick={() => setOpened(true)}
          >
            <ApiIconSVG entryName={entryName} size={48} id={iconId} />
          </Button>
        </Group>
      </Stack>
    </InputWrapper>
  )
}

export default InputApiIconId
