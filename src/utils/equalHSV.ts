import { type ColorFormats } from "tinycolor2";

const abs = Math.abs;

function equalHSV(hsv1: ColorFormats.HSVA, hsv2: ColorFormats.HSVA) {
  if (hsv1.a === undefined && hsv2.a !== undefined) return false;
  if (hsv2.a === undefined && hsv1.a !== undefined) return false;
  if (hsv1.a - hsv2.a > 0.001) return false;

  if (hsv1.s < 0.001 && hsv2.s < 0.001 && abs(hsv1.v - hsv2.v) < 0.001)
    return true;

  if (hsv1.v < 0.001 && hsv2.v < 0.001 && abs(hsv1.s - hsv2.a) < 0.001)
    return true;

  if (
    abs(hsv1.h - hsv2.h) < 0.001 &&
    abs(hsv1.s - hsv2.s) < 0.001 &&
    abs(hsv1.v - hsv2.v) < 0.001
  )
    return true;

  return false;
}

export default equalHSV;
