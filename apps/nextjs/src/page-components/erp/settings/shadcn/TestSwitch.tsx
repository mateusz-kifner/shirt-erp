import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";

function TestSwitch() {
  return (
    <>
      <div className="flex flex-col items-center space-x-2">
        <div className="flex items-center gap-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode" label="Airplane Mode" />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="color-mode" variant="color" />
          <Label htmlFor="color-mode" label="Airplane Mode" />
        </div>
      </div>
    </>
  );
}

export default TestSwitch;
