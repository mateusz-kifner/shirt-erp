// this hook is rerendering while history is changed

import { Reducer, useCallback, useReducer } from "react"

type State<T> = {
  past: T[]
  present: T
  future: T[]
}

type Action<T> = {
  type: "UNDO" | "REDO" | "SET" | "CLEAR"
  newPresent?: T
  initialPresent?: T
}

// Initial state that we pass into useReducer
const initialState: State<any> = {
  // Array of previous state values updated each time we push a new state
  past: [],
  // Current state value
  present: null,
  // Will contain "future" state values if we undo (so we can redo)
  future: [],
}
// Our reducer function to handle state changes based on action
function reducer<T>(state: State<T>, action: Action<T>) {
  const { past, present, future } = state
  switch (action.type) {
    case "UNDO":
      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      }
    case "REDO":
      const next = future[0]
      const newFuture = future.slice(1)
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      }
    case "SET":
      const { newPresent } = action
      if (newPresent === present) {
        return state
      }
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      }
    case "CLEAR":
      const { initialPresent } = action
      return {
        ...initialState,
        present: initialPresent,
      }
  }
}
// Hook
function useHistory<T = any>(
  initialPresent: T
): [
  value: T,
  setValue: (newPresent: T) => void,
  handlers: {
    undo: () => void
    redo: () => void
    clear: () => void
    canUndo: boolean
    canRedo: boolean
    history: State<T>
  }
] {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    present: initialPresent,
  })
  const canUndo = state.past.length !== 0
  const canRedo = state.future.length !== 0
  // Setup our callback functions
  // We memoize with useCallback to prevent unnecessary re-renders
  const undo = useCallback(() => {
    if (canUndo) {
      dispatch({ type: "UNDO" })
    }
  }, [canUndo, dispatch])
  const redo = useCallback(() => {
    if (canRedo) {
      dispatch({ type: "REDO" })
    }
  }, [canRedo, dispatch])
  const set = useCallback(
    (newPresent: T) => dispatch({ type: "SET", newPresent }),
    [dispatch]
  )
  const clear = useCallback(
    () => dispatch({ type: "CLEAR", initialPresent }),
    [dispatch]
  )
  // If needed we could also return past and future state
  return [
    state.present as T,
    set,
    { undo, redo, clear, canUndo, canRedo, history: state as State<T> },
  ]
}

export default useHistory
