import { type FileType } from "@/schema/fileSchema";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

interface DesignImageProps {
  file: Partial<FileType>;
}

function DesignImage(props: DesignImageProps) {
  const { file } = props;
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
    ({ down, offset: [ox, oy] }) =>
      api.start({ x: ox, y: oy, immediate: down }),
    {
      bounds: { left: -width, right: 800, top: -height, bottom: 800 },
    }
  );

  const [styleTL, apiTL] = useSpring(() => ({ x: 0, y: 0 }));

  const bindTL = useDrag(
    ({ down, offset: [ox, oy] }) =>
      apiTL.start({ x: ox, y: oy, immediate: down }),
    {
      bounds: { left: -width, right: 800, top: -height, bottom: 800 },
    }
  );

  return (
    <>
      <animated.div
        {...bind()}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: `url(${url})`,
          ...style,
        }}
        className="absolute left-0 top-0 touch-none"
      ></animated.div>
      <animated.div
        {...bindTL()}
        style={{ ...styleTL }}
        className="absolute left-0 top-0 h-6 w-6 touch-none rounded-full bg-sky-600"
      ></animated.div>
    </>
  );
}

export default DesignImage;
