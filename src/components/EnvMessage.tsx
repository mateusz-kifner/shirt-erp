import { useLocalStorage } from "@mantine/hooks";
import { IconQuestionMark } from "@tabler/icons-react";
import { env } from "../env.mjs";
// import Markdown from "./details/Markdown";

import Button from "./ui/Button";
import Modal from "./ui/Modal";

const EnvMessage = () => {
  const message = env.NEXT_PUBLIC_START_MESSAGE;
  const [envMessageOpen, setEnvMessageOpen] = useLocalStorage({
    key: "env-message",
    defaultValue: true,
  });

  if (!message) return null;

  return (
    <>
      <Button size="icon"
        style={{ position: "fixed", right: 8, bottom: 8, zIndex: 999999 }}
        onClick={() => setEnvMessageOpen(true)}
      >
        <IconQuestionMark size={32} />
      </Button>
      <Modal
        open={envMessageOpen}
        onClose={() => {
          setEnvMessageOpen(false);
        }}
      >
        {/* <Markdown value={message.split("\\n").join("\n") ?? ""} /> */}
        {message.split("\\n").join("\n") ?? ""}
      </Modal>
    </>
  );
};

export default EnvMessage;
