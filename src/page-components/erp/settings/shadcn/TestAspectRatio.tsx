import { AspectRatio } from "@/components/ui/AspectRatio";

function TestAspectRatio() {
  return (
    <div className="h-36 max-h-3xl min-h-36 w-36 min-w-36 max-w-3xl resize overflow-auto border border-red-500 border-solid">
      <AspectRatio ratio={16 / 9}>
        <img
          src="/assets/White%20Tshirt%20-%201600x1571.png"
          alt="test"
          className="h-full w-full rounded-md bg-red-200 object-cover"
        />
      </AspectRatio>
    </div>
  );
}

export default TestAspectRatio;
