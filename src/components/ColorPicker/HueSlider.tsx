import { useMove } from "@mantine/hooks";
import { useEffect } from "react";
import tinycolor2, { type ColorFormats } from "tinycolor2";

const TRACK_THICKNESS = 28;
const THUMB_SIZE = 20;

interface ColorSliderProps {
  value: ColorFormats.HSVA;
  disabled?: boolean;
  onChange: (value: ColorFormats.HSVA) => void;
  onActive?: (isActive: boolean) => void;
}

function HueSlider(props: ColorSliderProps) {
  const { value, onChange, onActive, disabled } = props;
  const { ref, active } = useMove(
    ({ x }) => !disabled && onChange?.({ ...value, h: x })
  );
  const thumbColor = tinycolor2.fromRatio({
    h: value.h,
    s: 1,
    v: 1,
  });

  useEffect(() => {
    onActive?.(active);
  }, [active]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 360,
        minWidth: 360,
        touchAction: "none",
        forcedColorAdjust: "none",
        position: "relative",
      }}
      ref={ref}
    >
      <div
        style={{
          height: TRACK_THICKNESS,
          width: "100%",
          borderRadius: 4,
          touchAction: "none",
          forcedColorAdjust: "none",
          background:
            "linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)",
        }}
      >
        <div
          className="absolute box-border -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height] duration-[50ms] ease-in-out"
          style={{
            top: TRACK_THICKNESS / 2,
            border: "2px solid white",
            boxShadow: "0 0 0 1px black, inset 0 0 0 1px black",
            width: false ? TRACK_THICKNESS + 4 : THUMB_SIZE,
            height: false ? TRACK_THICKNESS + 4 : THUMB_SIZE,
            background: thumbColor.toHexString(),
            left: value.h * 360,
          }}
        ></div>
      </div>
    </div>
  );
}

export default HueSlider;
