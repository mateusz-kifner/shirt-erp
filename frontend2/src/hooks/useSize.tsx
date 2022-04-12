import { useState } from "react"
import useEffectOnce from "./useEffectOnce"

// by WebDevSimplified
export default function useSize(ref: React.MutableRefObject<any>) {
  const [size, setSize] = useState({})

  useEffectOnce(() => {
    if (ref.current == null) return
    const observer = new ResizeObserver(([entry]) => setSize(entry.contentRect))
    observer.observe(ref.current)
    return () => observer.disconnect()
  })

  return size as {
    x: number
    y: number
    width: number
    height: number
    top: number
    right: number
    bottom: number
    left: number
  }
}
