import { cn } from "@/utils/cn";

const NavigationGradient = ({
  className,
  color = "transparent",
}: {
  className?: string;
  color?: string;
}) => {
  return (
    <div
      className={cn(
        "isolate min-h-screen w-full min-w-96 translate-y-[12.5%] scale-y-125 overflow-hidden bg-card",
        className,
      )}
    >
      <div
        style={{
          backgroundImage: `radial-gradient(circle at 0% 0%, ${color},${color}88 50%, transparent 100%)`,
        }}
        className="absolute top-0 left-0 h-1/2 w-[30rem]"
      >
        <div className="absolute bottom-0 right-0 z-20 h-screen w-full bg-card [mask-image:linear-gradient(to_top,white,transparent)]" />
        <div className="absolute bottom-0 right-0 z-20 h-full w-full bg-card [mask-image:linear-gradient(to_left,white,transparent)]" />
      </div>
    </div>
  );
};

export default NavigationGradient;
