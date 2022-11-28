import { ActionIcon, Modal, TypographyStylesProvider } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import React, { useId } from "react"
import { QuestionMark } from "tabler-icons-react"
import { env } from "../env/client.mjs"
import Markdown from "./details/Markdown"

const EnvMessage = () => {
  const message = env.NEXT_PUBLIC_START_MESSAGE
  const [envMessageOpen, setEnvMessageOpen] = useLocalStorage({
    key: "env-message",
    defaultValue: true,
  })

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
        size="xl"
      >
        <TypographyStylesProvider>
          <Markdown value={message.split("\\n").join("\n") ?? ""} />
        </TypographyStylesProvider>
      </Modal>
    </>
  )
}

export default EnvMessage
