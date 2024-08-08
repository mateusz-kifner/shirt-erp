import Button from "@shirterp/ui-web/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shirterp/ui-web/Card";
import { Input } from "@shirterp/ui-web/Input";
import { Label } from "@shirterp/ui-web/Label";

function TestCard() {
  return (
    <Card className="flex gap-4 bg-white p-4 dark:bg-stone-950">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <img
            src="/assets/White%20Tshirt%20-%201600x1571.png"
            alt="test"
            className="bg-blue-200"
          />
        </CardContent>
        <CardFooter className="justify-end">
          <Button>Test</Button>
        </CardFooter>
      </Card>
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Name of your project" />
                <Input id="name" placeholder="Name of your project" />
                <Input id="name" placeholder="Name of your project" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
    </Card>
  );
}

export default TestCard;
