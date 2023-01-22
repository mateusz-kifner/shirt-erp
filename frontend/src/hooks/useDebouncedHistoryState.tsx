import { useDebouncedValue } from "@mantine/hooks"
import { useCallback, useEffect, useRef, useState } from "react"

export default function useDebouncedStateWithHistory<T>(
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
    canUndo: boolean
    canRedo: boolean
  }
] {
  // true Value
  const [canUndo, setCanUndo] = useState<boolean>(false)
  const [canRedo, setCanRedo] = useState<boolean>(false)
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
      setCanRedo(pointerRef.current < historyRef.current.length - 1)
      setCanUndo(pointerRef.current > 0)
    }
  }

  useEffect(() => {
    setHistory(debounced)
  }, [debounced])

  const undo = useCallback(() => {
    if (pointerRef.current <= 0) return
    pointerRef.current--
    setValue(historyRef.current[pointerRef.current])
    setCanRedo(pointerRef.current < historyRef.current.length - 1)
    setCanUndo(pointerRef.current > 0)
  }, [])

  const redo = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return
    pointerRef.current++
    setValue(historyRef.current[pointerRef.current])
    setCanRedo(pointerRef.current < historyRef.current.length - 1)
    setCanUndo(pointerRef.current > 0)
  }, [])

  const go = useCallback((index: number) => {
    if (index < 0 || index > historyRef.current.length - 1) return
    pointerRef.current = index
    setValue(historyRef.current[pointerRef.current])
    setCanRedo(pointerRef.current < historyRef.current.length - 1)
    setCanUndo(pointerRef.current > 0)
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
      canUndo,
      canRedo,
    },
  ]
}
