import { useEffect } from "react"

// by WebDevSimplified

export default function useEffectOnce(cb: React.EffectCallback) {
  // @ts-ignore
  // eslint-disable-next-line
  useEffect(cb, [])
}
