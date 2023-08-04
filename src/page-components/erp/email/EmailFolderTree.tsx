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
import { useId } from "react";

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
  emailClientId: number;
  active?: string;
  onActive?: (active?: string) => void;
}

function EmailFolderTree(props: EmailFolderTreeProps) {
  const { emailClientId, active, onActive } = props;
  const uuid = useId();
  const { data } = api.email.getFolderTree.useQuery(emailClientId, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  return (
    <div className="flex w-40 flex-col gap-2 rounded bg-white p-2 dark:bg-stone-950">
      {data &&
        data.folders.map((folder, index) => (
          <>
            <EmailTreeButton
              folder={folder}
              className={
                active === folder.path
                  ? "justify-start bg-black/10  text-stone-900 dark:bg-white/10 dark:text-stone-50"
                  : "justify-start"
              }
              onClick={() => onActive?.(folder.path)}
              key={`${uuid}${index}`}
            />
            {folder?.folders?.map((folder, index2) => (
              <EmailTreeButton
                folder={folder}
                className={
                  active === folder.path
                    ? "ml-3 justify-start bg-black/10  text-stone-900 dark:bg-white/10 dark:text-stone-50"
                    : "ml-3  justify-start"
                }
                onClick={() => onActive?.(folder.path)}
                key={`${uuid}${index}:${index2}`}
              />
            ))}
          </>
        ))}
    </div>
  );
}

export default EmailFolderTree;
