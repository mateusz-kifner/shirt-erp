import Button from "@shirterp/ui-web/Button";
import { IconAlertCircle } from "@tabler/icons-react";

function TestButton() {
  return (
    <>
      <div className="flex gap-2">
        <Button>primary</Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="outline">outline</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="link">link</Button>
      </div>
      <div className="flex gap-2">
        <Button size="xs">Size XS</Button>
        <Button size="sm">Size SM</Button>
        <Button size="default">Size default</Button>
        <Button size="lg">Size LG</Button>
        <Button size="icon">
          <IconAlertCircle />
        </Button>
      </div>
    </>
  );
}

export default TestButton;
