import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";

function TestSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label label="Name" htmlFor="name" className="text-right"></Label>
            <Input
              id="name"
              value="Pedro Duarte"
              className="col-span-3"
              onChange={() => {}}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              label="Username"
              htmlFor="username"
              className="text-right"
            ></Label>
            <Input
              id="username"
              value="@peduarte"
              className="col-span-3"
              onChange={() => {}}
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default TestSheet;
