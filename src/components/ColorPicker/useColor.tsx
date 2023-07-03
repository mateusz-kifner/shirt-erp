import { useState } from "react";
import tinycolor2, { type ColorFormats } from "tinycolor2";

const useColor = (
  initialColor?: ColorFormats.HSVA,
  onChange?: (HSVA: ColorFormats.HSVA) => void
) => {
  const [color, setColor] = useState(tinycolor2(initialColor).toHsv());

  const colorObj = tinycolor2.fromRatio(color);

  const setHSV = (color: { h: number; s: number; v: number; a: number }) => {
    const newColor = tinycolor2.fromRatio(color);
    if (newColor.isValid()) {
      onChange?.(color);
      setColor(color);
    }
    return newColor.isValid();
  };

  const setRGB = (color: { r: number; g: number; b: number; a: number }) => {
    const newColor = tinycolor2.fromRatio(color);
    if (newColor.isValid()) {
      const newColorHSV = newColor.toHsv();
      onChange?.(newColorHSV);
      setColor(newColorHSV);
    }
    return newColor.isValid();
  };

  const setHex = (hex: string) => {
    const newColor = tinycolor2(hex);
    if (newColor.isValid()) {
      const newColorHSV = newColor.toHsv();
      onChange?.(newColorHSV);
      setColor(newColorHSV);
    }
    return newColor.isValid();
  };

  return {
    color,
    setColor,
    setRGB,
    getRGBA: () => colorObj.toRgb(),
    getRGBAString: () => colorObj.toRgbString(),
    setHSV,
    getHSV: () => color,
    getHSVString: () => colorObj.toHsvString(),
    setHex,
    getHex8: () => colorObj.toHex8String(),
  };
};

export default useColor;
