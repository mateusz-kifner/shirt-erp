import { Badge } from "@/components/ui/Badge";

function TestBadge() {
  return (
    <>
      <Badge>primary</Badge>
      <Badge variant="secondary">secondary</Badge>
      <Badge variant="outline">outline</Badge>
      <Badge variant="destructive">destructive</Badge>
      <Badge className="border-transparent bg-green-700 hover:bg-green-700/80">
        custom color
      </Badge>
    </>
  );
}

export default TestBadge;
