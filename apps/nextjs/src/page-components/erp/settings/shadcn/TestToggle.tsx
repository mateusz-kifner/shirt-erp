import { Card } from "@shirterp/ui-web/Card";
import { Toggle } from "@shirterp/ui-web/Toggle";
import { IconAlertCircle } from "@tabler/icons-react";

function TestToggle() {
  return (
    <Card className="bg-white p-2 dark:bg-stone-950">
      <div className="flex gap-2">
        <Toggle aria-label="Toggle italic">
          <IconAlertCircle className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle italic" variant="outline">
          <IconAlertCircle className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle italic">
          <IconAlertCircle className="h-4 w-4" /> Text
        </Toggle>
      </div>
      <div className="flex gap-2">
        <Toggle aria-label="Toggle italic" size="sm">
          <IconAlertCircle className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle italic" size="default">
          <IconAlertCircle className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle italic" size="lg">
          <IconAlertCircle className="h-4 w-4" />
        </Toggle>
      </div>
    </Card>
  );
}

export default TestToggle;
