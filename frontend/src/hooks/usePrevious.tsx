import { useEffect, useState } from "react"

// Hook
function usePrevious<T>(value: T) {
  const [val, setVal] = useState<T>(value)

  useEffect(() => {
    if (value !== val) setVal(value)
  }, [value])
  return val
}

export default usePrevious
