import { AspectRatio } from "@/components/ui/AspectRatio";

function TestAspectRatio() {
  return (
    <div className="min-h-36 min-w-36 max-h-3xl h-36 w-36 max-w-3xl resize overflow-auto border border-solid  border-red-500">
      <AspectRatio ratio={16 / 9}>
        <img
          src="/assets/White%20Tshirt%20-%201600x1571.png"
          alt="test image"
          className="h-full w-full rounded-md bg-red-200 object-cover"
        />
      </AspectRatio>
    </div>
  );
}

export default TestAspectRatio;
