type defaultColorNames =
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose"

type extendedColorNames =
  // |"primary"
  // | "grape"
  "dark"

export type TailwindColorNames = Extract<
  defaultColorNames | extendedColorNames,
  any
>
