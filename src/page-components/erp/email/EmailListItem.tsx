import Button from "@/components/ui/Button";
import { FetchMessageObject } from "imapflow";

interface EmailListItemProps {
  onChange?: (item: Partial<FetchMessageObject>) => void;
  value: Partial<FetchMessageObject>;
  active?: boolean;
  disabled?: boolean;
}

function EmailListItem(props: EmailListItemProps) {
  const { onChange, value, active, disabled } = props;
  return (
    <Button
      size="sm"
      variant="ghost"
      className="grid w-full grid-cols-3 gap-2 text-left"
    >
      <div className="flex flex-nowrap overflow-hidden whitespace-nowrap">
        {value.envelope?.from.map((sender) => (
          <span>{sender.name ? sender.name : sender.address}</span>
        ))}
      </div>
      <div className="col-start-2 col-end-4 flex flex-nowrap overflow-hidden whitespace-nowrap">
        {value.envelope?.subject}
      </div>
    </Button>
  );
}

export default EmailListItem;
