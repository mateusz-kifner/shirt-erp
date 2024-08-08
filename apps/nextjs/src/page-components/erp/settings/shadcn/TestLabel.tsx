import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

function TestLabel() {
  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label label="Picture" htmlFor="picture" />
        <Input id="picture" type="file" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox_unchecked" />
        <Label label="Unchecked" htmlFor="checkbox_unchecked" />
      </div>
    </>
  );
}

export default TestLabel;
