import { FileType } from "@/schema/fileSchema";
import { useMove } from "@mantine/hooks";
import { useState } from "react";

interface DesignImageProps {
  file: Partial<FileType>;
}

function DesignImage(props: DesignImageProps) {
  const { file } = props;
  const [value, setValue] = useState({ x: 0.2, y: 0.6 });

  const { ref, active } = useMove<HTMLImageElement>(setValue);

  const url = file.mimetype?.startsWith("image")
    ? `/api/files/${file.filename}${
        file?.token && file.token.length > 0 ? "?token=" + file?.token : ""
      }`
    : undefined;

  return (
    <div className="absolute inset-0" ref={ref}>
      <img
        src={url}
        style={{
          width: `${file.width}px`,
          height: `${file.height}px`,
          position: "absolute",
          left: `${value.x * 100}%`,
          top: `${value.y * 100}%`,
        }}
      />
    </div>
  );
}

export default DesignImage;
