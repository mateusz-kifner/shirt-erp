import { ScrollArea } from "@shirterp/ui-web/ScrollArea";
import { lorem } from "../lorem";
import { Separator } from "@shirterp/ui-web/Separator";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

function TestScrollArea() {
  return (
    <>
      <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
        {lorem}
        {lorem}
      </ScrollArea>
      <ScrollArea className="h-72 w-48 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 font-medium text-sm leading-none">Tags</h4>
          {tags.map((tag, index) => (
            <>
              <div key={`TestScrollArea${tag}__${index}`} className="text-sm">
                {tag}
              </div>
              <Separator className="my-2" />
            </>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}

export default TestScrollArea;
