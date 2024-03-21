import { useMove } from "@mantine/hooks";
import _ from "lodash";
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
    ({ x }) => !disabled && onChange?.({ ...value, a: x }),
  );

  const sliderColor = tinycolor2.fromRatio(_.omit(value, ["a"]));

  const thumbColor = tinycolor2.fromRatio(value);

  useEffect(() => {
    onActive?.(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        background: 'url("/assets/checkerboard.svg") 0px 0px/16px 16px repeat',
        borderRadius: 4,
        height: TRACK_THICKNESS,
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
          background: `linear-gradient(to right, rgba(0,0,0,0), ${sliderColor.toHex8String()})`,
        }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 absolute box-border rounded-full transition-[width,height] duration-[50ms] ease-in-out"
          style={{
            top: TRACK_THICKNESS / 2,
            border: "2px solid white",
            boxShadow: "0 0 0 1px black, inset 0 0 0 1px black",
            width: false ? TRACK_THICKNESS + 4 : THUMB_SIZE,
            height: false ? TRACK_THICKNESS + 4 : THUMB_SIZE,
            background: 'url("/assets/checkerboard.svg")  repeat',
            left: value.a * 360,
          }}
        >
          <div
            className="h-full w-full rounded-full"
            style={{ background: thumbColor.toHex8String() }}
          />
        </div>
      </div>
    </div>
  );
}

export default HueSlider;
