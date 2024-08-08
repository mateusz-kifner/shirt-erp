import {
  getRandomColorByNumber,
  getRandomColorByString,
} from "@/utils/getRandomColor";
import type { ReactNode } from "react";

interface ItemAvatarProps {
  children?: ReactNode;
  colorSeed?: number | string;
}

function ItemAvatar(props: ItemAvatarProps) {
  const { colorSeed = 0, children } = props;
  return (
    <div
      className="relative flex h-10 w-10 select-none items-center justify-center rounded-full font-bold text-base text-stone-800 before:absolute before:inset-0 before:z-[-1] before:rounded-full before:bg-card dark:text-stone-200"
      style={{
        background: `radial-gradient(circle, transparent 58%, ${
          typeof colorSeed === "number"
            ? getRandomColorByNumber(colorSeed)
            : getRandomColorByString(colorSeed)
        }  60%)`,
      }}
    >
      {children}
    </div>
  );
}
export default ItemAvatar;
