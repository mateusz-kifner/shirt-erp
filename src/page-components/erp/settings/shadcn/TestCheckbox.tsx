import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";

function TestCheckbox() {
  return (
    <>
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox_unchecked" />
        <Label label="Unchecked" htmlFor="checkbox_unchecked" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox_checked" checked />
        <Label label="Checked" htmlFor="checkbox_checked" />
      </div>
    </>
  );
}

export default TestCheckbox;
