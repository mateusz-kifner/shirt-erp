import Button from "@/components/ui/Button";
import { IconAlertCircle, IconX } from "@tabler/icons-react";
import { toast } from "sonner";

function TestSonner() {
  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
          });
        }}
      >
        Show Toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            icon: <IconAlertCircle />,
            position: "bottom-center",
            dismissible: true,
            cancel: {
              label: <IconX />,
            },
            cancelButtonStyle: {
              width: "1.8rem",
              height: "1.8rem",
            },
          })
        }
      >
        Show Toast
      </Button>
    </>
  );
}

export default TestSonner;
