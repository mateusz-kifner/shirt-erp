import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";

function TestSwitch() {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode" label="Airplane Mode"></Label>
      </div>
    </>
  );
}

export default TestSwitch;
