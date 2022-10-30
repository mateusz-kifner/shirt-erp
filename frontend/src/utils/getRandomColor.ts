import simpleHash from "./simpleHash"

export const colors = [
  "#2B8A3E",
  "#D9480F",
  "#364FC7",
  "#C92A2A",
  "#F59F00",
  "#0B7285",
  "#5C940D",
  "#5F3DC4",
  "#A61E4D",
  "#862E9C",
]

export function getRandomColorByNumber(num?: number | null) {
  return colors[(num ?? 0) % colors.length]
}

export function getRandomColorByString(str?: string | null) {
  return colors[Math.abs(simpleHash("" + str)) % colors.length]
}
