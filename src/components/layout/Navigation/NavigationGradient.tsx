import { cn } from "@/utils/cn";

const NavigationGradient = ({
  className,
  highContrast = true,
  color = "transparent",
}: {
  className?: string;
  highContrast?: boolean;
  color?: string;
}) => {
  const gradient = `radial-gradient(circle at 0% 0%, ${color},${color}88 50%, transparent 100%)`;
  return (
    <div
      className={cn(
        "isolate min-h-screen w-full min-w-[32rem] translate-y-[12.5%] scale-y-125 overflow-hidden bg-card",
        className,
      )}
    >
      <div
        style={{
          backgroundImage: gradient,
        }}
        className="absolute top-0 left-0 h-1/2 w-[32rem]"
      >
        <div className="absolute right-0 bottom-0 z-20 h-screen w-full bg-card [mask-image:linear-gradient(to_top,white,transparent)]" />
        <div className="absolute right-0 bottom-0 z-20 h-full w-full bg-card [mask-image:linear-gradient(to_left,white,transparent)]" />
      </div>
    </div>
  );
};

export default NavigationGradient;
