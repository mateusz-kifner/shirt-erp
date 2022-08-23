import { ActionIcon, Modal } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import React, { useId, useState } from "react"
import { QuestionMark } from "tabler-icons-react"

const EnvMessage = () => {
  const message = process.env.NEXT_PUBLIC_START_MESSAGE
  const [envMessageOpen, setEnvMessageOpen] = useLocalStorage({
    key: "env-message",
    defaultValue: true,
  })
  const uuid = useId()
  console.log(message)
  if (!message) return null

  return (
    message && (
      <>
        <ActionIcon
          style={{ position: "fixed", right: 4, bottom: 4, zIndex: 999999 }}
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
  )
}

export default EnvMessage
