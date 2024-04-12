import { IconArrowNarrowDown, IconArrowNarrowUp } from "@tabler/icons-react";
import Button, { type ButtonProps } from "../ui/Button";
import { cn } from "@/utils/cn";

interface HeaderButtonProps extends ButtonProps {
  sortOrder?: "desc" | "asc";
}

function HeaderButton(props: HeaderButtonProps) {
  const { children, className, sortOrder, ...moreProps } = props;
  return (
    <Button variant="ghost" className={cn("gap-0", className)} {...moreProps}>
      {children}
      {sortOrder !== undefined ? (
        sortOrder === "asc" ? (
          <IconArrowNarrowUp className="h-5 w-5" />
        ) : (
          <IconArrowNarrowDown className="h-5 w-5" />
        )
      ) : (
        <div className="h-5 w-5" />
      )}
    </Button>
  );
}

export default HeaderButton;
