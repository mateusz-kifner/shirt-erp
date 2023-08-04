import Button, { ButtonProps } from "@/components/ui/Button";
import { api } from "@/utils/api";
import {
  IconBriefcase,
  IconMail,
  IconPoo,
  IconSend,
  IconTrash,
} from "@tabler/icons-react";
import { ListTreeResponse } from "imapflow";

function getIcon(specialUse: string) {
  switch (specialUse) {
    case "\\Inbox":
      return <IconMail />;
    case "\\Sent":
      return <IconSend />;
    case "\\Drafts":
      return <IconBriefcase />;
    case "\\Junk":
      return <IconPoo />;
    case "\\Trash":
      return <IconTrash />;
    default:
      return <IconMail />;
  }
}

interface EmailTreeButtonProps extends ButtonProps {
  folder: ListTreeResponse;
}

function EmailTreeButton(props: EmailTreeButtonProps) {
  const { folder, ...moreProps } = props;

  return (
    <Button size="xs" variant="ghost" {...moreProps}>
      {getIcon(folder?.specialUse)}
      {folder.name}
    </Button>
  );
}

interface EmailFolderTreeProps {
  mailboxId: number;
}

function EmailFolderTree(props: EmailFolderTreeProps) {
  const { mailboxId } = props;
  const { data } = api.email.getFolderTree.useQuery(mailboxId, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  return (
    <div className="flex w-40 flex-col gap-2 rounded bg-white p-2 dark:bg-stone-950">
      {data &&
        data.folders.map((folder) => (
          <>
            <EmailTreeButton folder={folder} className="justify-start" />
            {folder?.folders?.map((folder) => (
              <EmailTreeButton folder={folder} className="ml-3 justify-start" />
            ))}
          </>
        ))}
    </div>
  );
}

export default EmailFolderTree;
