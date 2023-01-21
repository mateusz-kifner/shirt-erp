import { useDebouncedValue } from "@mantine/hooks"
import { useCallback, useEffect, useRef, useState } from "react"

export default function useStateWithHistory<T>(
  defaultValue: T,
  { capacity = 10, wait = 200, leading = false } = {}
): [
  value: T,
  setValue: (v: T | ((val: T) => T)) => void,
  debouncedValue: T,
  handlers: {
    history: T[]
    pointer: number
    undo: () => void
    redo: () => void
    clear: () => void
    go: (index: number) => void
  }
] {
  // true Value
  const [value, setValue] = useState<T>(defaultValue)
  // history array
  const historyRef = useRef([value])
  // history pointer
  const pointerRef = useRef(0)
  const [debounced, cancel] = useDebouncedValue(value, wait, { leading })
  console.table(historyRef.current)

  const set = (v: React.SetStateAction<T>) => {
    cancel()
    setValue(v)
  }

  const setHistory = (value: T) => {
    if (historyRef.current[pointerRef.current] !== value) {
      if (pointerRef.current < historyRef.current.length - 1) {
        historyRef.current.splice(pointerRef.current + 1)
      }
      historyRef.current.push(value)

      while (historyRef.current.length > capacity) {
        historyRef.current.shift()
      }
      pointerRef.current = historyRef.current.length - 1
    }
  }

  useEffect(() => {
    setHistory(debounced)
  }, [debounced])

  const undo = useCallback(() => {
    if (pointerRef.current <= 0) return
    pointerRef.current--
    setValue(historyRef.current[pointerRef.current])
  }, [])

  const redo = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return
    pointerRef.current++
    setValue(historyRef.current[pointerRef.current])
  }, [])

  const go = useCallback((index: number) => {
    if (index < 0 || index > historyRef.current.length - 1) return
    pointerRef.current = index
    setValue(historyRef.current[pointerRef.current])
  }, [])

  const clear = useCallback(() => setValue(defaultValue), [])

  return [
    value,
    set,
    debounced,
    {
      history: historyRef.current,
      pointer: pointerRef.current,
      undo,
      redo,
      go,
      clear,
    },
  ]
}
