import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { IconAlertCircle } from "@tabler/icons-react";

function TestAlert() {
  return (
    <>
      <Alert className="m-auto w-96">
        <IconAlertCircle className="h-4 w-4" />
        <AlertTitle>Alert</AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
      <Alert className="m-auto w-96" variant="destructive">
        <IconAlertCircle className="h-4 w-4" />
        <AlertTitle>Alert</AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    </>
  );
}

export default TestAlert;
