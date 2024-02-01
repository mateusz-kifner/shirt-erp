import { type File } from "@/schema/fileZodSchema";
import { cn } from "@/utils/cn";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { type HTMLAttributes } from "react";

interface DesignImageProps extends HTMLAttributes<HTMLDivElement> {
  file: Partial<File>;
  active?: boolean;
  onActive?: (active: boolean) => void;
}

function DesignImage(props: DesignImageProps) {
  const { file, active, onActive, ...moreProps } = props;
  const width = file.width ?? 0;
  const height = file.height ?? 0;

  const url = file.mimetype?.startsWith("image")
    ? `/api/files/${file.filename}${
        file?.token && file.token.length > 0 ? "?token=" + file?.token : ""
      }`
    : undefined;

  const [style, api] = useSpring(() => ({ x: 0, y: 0 }));

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(
    ({ down, offset: [ox, oy], active }) => {
      void api.start({ x: ox, y: oy, immediate: down });
      onActive?.(active);
    },

    {
      bounds: { left: -width, right: 800, top: -height, bottom: 800 },
    },
  );

  return (
    <animated.div
      {...bind()}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: `url(${url})`,
        ...style,
      }}
      className={cn(
        "absolute left-0 top-0 touch-none border-2 border-solid",
        active && "border-sky-600",
      )}
      {...moreProps}
    ></animated.div>
  );
}

export default DesignImage;
