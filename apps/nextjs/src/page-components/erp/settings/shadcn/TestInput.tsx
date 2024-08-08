import Button from "@shirterp/ui-web/Button";
import { Input } from "@shirterp/ui-web/Input";
import { Label } from "@shirterp/ui-web/Label";

function TestInput() {
  return (
    <>
      <div>
        <Input type="email" placeholder="Email" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label label="Picture" htmlFor="picture" />
        <Input id="picture" type="file" />
      </div>
      <div>
        <Input disabled type="email" placeholder="Email" />
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="email" placeholder="Email" />
        <Button type="submit">Subscribe</Button>
      </div>
    </>
  );
}

export default TestInput;
