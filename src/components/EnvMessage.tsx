import { useLocalStorage } from "@mantine/hooks";
import { HelpCircleIcon } from "lucide-react";
import { env } from "../env.mjs";
import Markdown from "./details/Markdown";

const EnvMessage = () => {
  const message = env.NEXT_PUBLIC_START_MESSAGE;
  const [envMessageOpen, setEnvMessageOpen] = useLocalStorage({
    key: "env-message",
    defaultValue: true,
  });

  if (!message) return null;

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
        <HelpCircleIcon size={32} />
      </ActionIcon>
      <Modal
        opened={envMessageOpen}
        onClose={() => {
          setEnvMessageOpen(false);
        }}
        size="xl"
      >
        <TypographyStylesProvider>
          <Markdown value={message.split("\\n").join("\n") ?? ""} />
        </TypographyStylesProvider>
      </Modal>
    </>
  );
};

export default EnvMessage;
