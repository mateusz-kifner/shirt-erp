import Button from "@shirterp/ui-web/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@shirterp/ui-web/Collapsible";
import { IconChevronsDown } from "@tabler/icons-react";
function TestCollapsible() {
  return (
    <Collapsible>
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="font-semibold text-sm">
          @peduarte starred 3 repositories
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <IconChevronsDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 font-mono text-sm">
        @radix-ui/primitives
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @radix-ui/colors
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @stitches/react
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default TestCollapsible;
