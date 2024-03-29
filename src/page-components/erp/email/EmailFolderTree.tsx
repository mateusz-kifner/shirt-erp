import Button, { type ButtonProps } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { EmailCredential } from "@/server/api/email/validator";
import { trpc } from "@/utils/trpc";
import { cn } from "@/utils/cn";
import {
  IconBriefcase,
  IconMail,
  IconPoo,
  IconRefresh,
  IconSend,
  IconTrash,
} from "@tabler/icons-react";
import type { ListTreeResponse } from "imapflow";
import { useId, useState } from "react";

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
  emailConfig: EmailCredential;
  active?: string;
  onActive?: (active?: string) => void;
  onRefetch?: () => void;
}

function EmailFolderTree(props: EmailFolderTreeProps) {
  const { active, onActive, onRefetch, emailConfig } = props;
  const uuid = useId();
  const { data } = trpc.email.getFolderTree.useQuery(emailConfig.id, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const isMobile = useIsMobile();
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-2",
        isMobile ? "" : "w-40 min-w-[10rem]",
      )}
    >
      <div className="flex h-10 flex-col gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            onRefetch?.();
            setLoadingAnimation(true);
            setTimeout(() => {
              setLoadingAnimation(false);
            }, 1500);
          }}
          className="relative justify-start p-1"
        >
          {emailConfig.user}
          <IconRefresh
            className={cn(
              "-bottom-1 absolute right-0 h-4 w-4 rounded-full bg-white transition-all dark:bg-stone-800",
              loadingAnimation &&
                "direction-reverse animate-spin bg-sky-200 dark:bg-sky-950",
            )}
          />
        </Button>

        <Separator />
      </div>
      {data?.folders.map((folder, index) => (
        <div className="contents" key={`${uuid}${index}`}>
          <EmailTreeButton
            folder={folder}
            className={
              active === folder.path
                ? "justify-start bg-black/10 text-stone-900 dark:bg-white/10 dark:text-stone-50"
                : "justify-start"
            }
            onClick={() => onActive?.(folder.path)}
          />
          {folder?.folders?.map((folder, index2) => (
            <EmailTreeButton
              folder={folder}
              className={
                active === folder.path
                  ? "ml-3 justify-start bg-black/10 text-stone-900 dark:bg-white/10 dark:text-stone-50"
                  : "ml-3 justify-start"
              }
              onClick={() => onActive?.(folder.path)}
              key={`${uuid}${index}:${index2}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default EmailFolderTree;
