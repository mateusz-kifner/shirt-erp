import { ActionIcon, Modal } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import React, { useId } from "react"
import { QuestionMark } from "tabler-icons-react"
import { env } from "../env/server.mjs"

const EnvMessage = () => {
  const message = env.NEXT_PUBLIC_START_MESSAGE
  const [envMessageOpen, setEnvMessageOpen] = useLocalStorage({
    key: "env-message",
    defaultValue: true,
  })
  const uuid = useId()
  if (!message) return null

  return (
    <>
      <ActionIcon
        style={{ position: "fixed", right: 8, bottom: 8, zIndex: 999999 }}
        size="xl"
        radius="xl"
        variant="gradient"
        gradient={{ from: "red", to: "orange" }}
        onClick={() => setEnvMessageOpen(true)}
      >
        <QuestionMark size={32} />
      </ActionIcon>
      <Modal
        opened={envMessageOpen}
        onClose={() => {
          setEnvMessageOpen(false)
        }}
      >
        <div>
          {message.split("\\n").map((val: string, index: number) => (
            <p key={uuid + index}>{val}</p>
          ))}
        </div>
      </Modal>
    </>
  )
}

export default EnvMessage
