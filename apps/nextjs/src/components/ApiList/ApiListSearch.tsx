import useTranslation from "@/hooks/useTranslation";
import { cn } from "@/utils/cn";
import { IconSearch } from "@tabler/icons-react";
import { type ComponentProps, useId } from "react";

interface ApiListSearchProps extends ComponentProps<"input"> {
  onChangeValue?: (value: string) => void;
}

function ApiListSearch(props: ApiListSearchProps) {
  const { className, onChangeValue, ...moreProps } = props;
  const uuid = useId();
  const t = useTranslation();
  return (
    <div className={cn(className, "group relative w-full grow")}>
      <input
        name={`search${uuid}`}
        id={`search${uuid}`}
        className="h-9 max-h-screen w-full resize-none gap-2 overflow-hidden whitespace-pre-line break-words rounded-md border border-solid bg-background py-2 pr-4 pl-8 text-sm leading-normal outline-none dark:focus:border-sky-600 focus:border-sky-600 dark:data-disabled:bg-transparent dark:read-only:bg-transparent data-disabled:bg-transparent read-only:bg-transparent dark:data-disabled:text-gray-500 data-disabled:text-gray-500 placeholder:text-muted-foreground dark:outline-none dark:read-only:outline-none read-only:outline-none"
        type="text"
        onChange={(e) => onChangeValue?.(e.target.value)}
        placeholder={`${t.search}...`}
        {...moreProps}
      />
      <IconSearch
        className="-translate-y-1/2 absolute top-1/2 left-1 stroke-input group-focus-within:stroke-muted-foreground"
        size={24}
      />
    </div>
  );
}

export default ApiListSearch;
