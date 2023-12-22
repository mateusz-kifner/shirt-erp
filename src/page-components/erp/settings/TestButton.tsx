import Button from "@/components/ui/Button";
import { IconAlertCircle } from "@tabler/icons-react";

function TestButton() {
  return (
    <>
      <Button>primary</Button>
      <Button variant="secondary">secondary</Button>
      <Button variant="outline">outline</Button>
      <Button variant="ghost">ghost</Button>
      <Button variant="link">link</Button>
      <Button size="xs">XS</Button>
      <Button size="sm">SM</Button>
      <Button size="default">default</Button>
      <Button size="lg">LG</Button>
      <Button size="icon">
        <IconAlertCircle />
      </Button>
    </>
  );
}

export default TestButton;
