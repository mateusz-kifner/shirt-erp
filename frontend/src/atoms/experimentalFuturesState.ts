import { atom } from "recoil"

export const experimentalFuturesState = atom<any>({
  key: "experimentalFuturesState",
  default: {
    advanced_navigation: false,
    search: true,
  },
})
