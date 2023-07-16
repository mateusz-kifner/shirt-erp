import { IconMessageCircle2 } from "@tabler/icons-react";
import Button from "../ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";

interface MessagesProps {}

function Messages(props: MessagesProps) {
  const {} = props;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full border-stone-600 bg-stone-800 hover:bg-stone-700 hover:text-stone-50"
          onClick={() => {
            // refetch();
          }}
        >
          <IconMessageCircle2 className="stroke-gray-200" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex flex-col gap-2"
        sideOffset={10}
      ></PopoverContent>
    </Popover>
  );
}

export default Messages;
