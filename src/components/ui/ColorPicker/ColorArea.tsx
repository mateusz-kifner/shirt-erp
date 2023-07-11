import { useMove } from "@mantine/hooks";
import { useEffect } from "react";
import tinycolor2, { type ColorFormats } from "tinycolor2";

const SIZE = 200;
const FOCUSED_THUMB_SIZE = 28;
const THUMB_SIZE = 20;
const BORDER_RADIUS = 4;

interface ColorAreaProps {
  value: ColorFormats.HSVA;
  disabled?: boolean;
  onChange?: (value: ColorFormats.HSVA) => void;
  onActive?: (isActive: boolean) => void;
}

function ColorArea(props: ColorAreaProps) {
  const { value, disabled, onChange, onActive } = props;
  const { ref, active } = useMove(
    ({ x, y }) => !disabled && onChange?.({ ...value, s: x, v: 1 - y })
  );

  const areaColor = tinycolor2.fromRatio({
    h: value.h,
    s: 1,
    v: 1,
    a: value.a,
  });
  const thumbColor = tinycolor2.fromRatio(value);

  useEffect(() => {
    onActive?.(active);
  }, [active]);

  return (
    <div
      style={{
        position: "relative",
        width: SIZE,
        height: SIZE,
        borderRadius: BORDER_RADIUS,
        opacity: disabled ? 0.3 : undefined,
        touchAction: "none",
        forcedColorAdjust: "none",
      }}
      ref={ref}
    >
      <div
        role="presentation"
        style={{
          backgroundColor: disabled ? "rgb(142, 142, 142)" : undefined,
          borderRadius: BORDER_RADIUS,
          height: SIZE,
          width: SIZE,
          background: `linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%),linear-gradient( 90deg, #fff 0%, ${areaColor.toHexString()} 100%)`,
          touchAction: "none",
          forcedColorAdjust: "none",
          willChange: "background",
        }}
      />
      <div
        role="presentation"
        className="absolute box-border -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height] duration-[50ms] ease-in-out"
        style={{
          background: disabled
            ? "rgb(142, 142, 142)"
            : thumbColor.toHexString(),
          border: `2px solid ${disabled ? "rgb(142, 142, 142)" : "white"}`,
          boxShadow: "0 0 0 1px black, inset 0 0 0 1px black",
          height: false ? FOCUSED_THUMB_SIZE + 4 : THUMB_SIZE,
          width: false ? FOCUSED_THUMB_SIZE + 4 : THUMB_SIZE,
          left: value.s * 200,
          top: 200 - value.v * 200,
        }}
      ></div>
    </div>
  );
}

export default ColorArea;
