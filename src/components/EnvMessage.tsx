import { useLocalStorage } from "@mantine/hooks";
import { IconQuestionMark } from "@tabler/icons-react";
import { env } from "../env.mjs";
// import Markdown from "./details/Markdown";

import Button from "./ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/Dialog";

const EnvMessage = () => {
  const message = env.NEXT_PUBLIC_START_MESSAGE;
  const [envMessageOpen, setEnvMessageOpen] = useLocalStorage({
    key: "env-message",
    defaultValue: true,
  });

  if (!message) return null;

  return (
    <Dialog
      open={envMessageOpen}
      onOpenChange={(open) => !open && setEnvMessageOpen(false)}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          style={{ position: "fixed", right: 8, bottom: 8, zIndex: 999999 }}
        >
          <IconQuestionMark size={32} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        {/* <Markdown value={message.split("\\n").join("\n") ?? ""} /> */}
        {message.split("\\n").join("\n") ?? ""}
      </DialogContent>
    </Dialog>
  );
};

export default EnvMessage;
