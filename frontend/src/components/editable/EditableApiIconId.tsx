import { Button, Group, Input, Modal, SimpleGrid, Stack } from "@mantine/core"
import { useEffect, useId, useState } from "react"
import { IconX } from "@tabler/icons-react"
import { useIconsContext } from "../../context/iconsContext"
import EditableInput from "../../types/EditableInput"
import ApiIconSVG from "../api/ApiIconSVG"

interface EditableApiIconIdProps extends EditableInput<number> {
  entryName?: string
}

const EditableApiIconId = ({
  label,
  value,
  initialValue,
  onSubmit,
  disabled,
  required,
  entryName,
}: EditableApiIconIdProps) => {
  const [opened, setOpened] = useState(false)
  const [iconId, setIconId] = useState<number | null>(
    value ?? initialValue ?? null
  )
  const { iconsData } = useIconsContext()
  const uuid = useId()

  useEffect(() => {
    value && setIconId(value)
  }, [value])

  if (!entryName) return null

  return (
    <Input.Wrapper
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
            iconsData[entryName as keyof typeof iconsData].map(
              (val: { id: number }) => (
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
              )
            )}
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
            <IconX size={96} />
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
    </Input.Wrapper>
  )
}

export default EditableApiIconId
