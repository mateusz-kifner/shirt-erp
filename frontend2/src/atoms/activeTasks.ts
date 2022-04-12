import { atom } from "recoil"
//import { OrderType } from "../types/OrderType"

// interface taskStateType {
//   openTasks: string[]
// }

export const taskState = atom<string[]>({
  key: "taskState",
  default: [],
})
