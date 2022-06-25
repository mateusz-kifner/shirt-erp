import { atom } from "recoil"

export const emailMessageState = atom<any>({
  key: "emailMessageState",
  default: [],
})
