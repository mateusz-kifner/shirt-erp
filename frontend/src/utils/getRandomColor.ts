import simpleHash from "./simpleHash"
import colorNames from "../models/color-names.json"
import { startCase, toLower } from "lodash"

const colorNamesValues = Object.values(colorNames)
const colorNamesKeys = Object.keys(colorNames)

function toTitleCase(str: string) {
  return startCase(toLower(str))
}

export const simpleColors = [
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
  return simpleColors[(num ?? 0) % simpleColors.length]
}

export function getRandomColorByString(str?: string | null) {
  return simpleColors[Math.abs(simpleHash("" + str)) % simpleColors.length]
}

export function getColorByName(name: string) {
  const index = colorNamesValues.indexOf(toTitleCase(name))
  return index !== -1 ? colorNamesKeys[index] : null
}
