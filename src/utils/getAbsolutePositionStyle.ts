import { type CSSProperties } from "react";

export default function getAbsolutePositionStyle(
  position: "left" | "right" | "top" | "bottom",
  spacing: number | string = 6
) {
  const style: CSSProperties = {};

  if (position === "left") {
    style.right = "100%";
    style.top = "50%";
    style.transform = "translateY(-50%)";
    style.marginRight = spacing;
  }
  if (position === "right") {
    style.left = "100%";
    style.top = "50%";
    style.transform = "translateY(-50%)";
    style.marginLeft = spacing;
  }

  if (position === "top") {
    style.bottom = "100%";
    style.left = "50%";
    style.transform = "translateX(-50%)";
    style.marginBottom = spacing;
  }

  if (position === "bottom") {
    style.top = "100%";
    style.left = "50%";
    style.transform = "translateX(-50%)";
    style.marginTop = spacing;
  }

  return style;
}
