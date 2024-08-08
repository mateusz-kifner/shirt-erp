import Button from "@shirterp/ui-web/Button";
import type { ListItemProps } from "@/types/ListItemProps";
import type { FetchMessageObject } from "imapflow";
import { useId } from "react";

function EmailListItem(props: ListItemProps<FetchMessageObject>) {
  const { onChange, value } = props;
  const uuid = useId();
  return (
    <Button
      size="sm"
      variant="ghost"
      className="grid w-full grid-cols-3 gap-2 text-left"
      onClick={() => onChange?.(value)}
    >
      <div className="flex flex-nowrap overflow-hidden whitespace-nowrap">
        {value.envelope?.from.map((sender, index) => (
          <span key={`${uuid}${index}`}>
            {sender.name ? sender.name : sender.address}
          </span>
        ))}
      </div>
      <div className="col-start-2 col-end-4 flex flex-nowrap overflow-hidden whitespace-nowrap">
        {value.envelope?.subject}
      </div>
    </Button>
  );
}

export default EmailListItem;
