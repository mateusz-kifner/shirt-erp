import { FileType } from "@/schema/fileSchema";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

interface DesignImageProps {
  file: Partial<FileType>;
}

function DesignImage(props: DesignImageProps) {
  const { file } = props;

  const url = file.mimetype?.startsWith("image")
    ? `/api/files/${file.filename}${
        file?.token && file.token.length > 0 ? "?token=" + file?.token : ""
      }`
    : undefined;

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    api.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down });
  });
  return (
    <animated.div
      style={{
        width: `${file.width}px`,
        height: `${file.height}px`,
        x,
        y,
        border: "4px solid red",
      }}
      className="touch-none"
      {...bind()}
    >
      <img
        src={url}
        style={{
          width: `${file.width}px`,
          height: `${file.height}px`,
        }}
      />
    </animated.div>
  );
}

export default DesignImage;
