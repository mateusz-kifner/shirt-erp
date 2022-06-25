import React from "react"
import { getTransitionStyles } from "./get-transition-styles"
import { useTransition } from "./useTransition"
import { MantineTransition } from "./transitions"

export interface TransitionProps {
  /** Predefined transition name or transition styles */
  transition: MantineTransition

  /** Transition duration in ms */
  duration?: number

  /** Exit transition duration in ms */
  exitDuration?: number

  /** Transition timing function, defaults to theme.transitionTimingFunction */
  timingFunction?: string

  /** When true, component will be mounted */
  mounted: boolean

  /** Render function with transition styles argument */
  children(styles: React.CSSProperties): React.ReactElement<any, any>

  /** Calls when exit transition ends */
  onExited?: () => void

  /** Calls when exit transition starts */
  onExit?: () => void

  /** Calls when enter transition starts */
  onEnter?: () => void

  /** Calls when enter transition ends */
  onEntered?: () => void
  displayNone?: boolean
}

export function TransitionNoUnmount({
  transition,
  duration = 250,
  exitDuration = duration,
  mounted,
  children,
  timingFunction,
  onExit,
  onEntered,
  onEnter,
  onExited,
  displayNone = true,
}: TransitionProps) {
  const { transitionDuration, transitionStatus, transitionTimingFunction } =
    useTransition({
      mounted,
      exitDuration,
      duration,
      // @ts-ignore
      timingFunction,
      onExit,
      onEntered,
      onEnter,
      onExited,
    })

  if (transitionDuration === 0) {
    return children({})
  }

  let styles = getTransitionStyles({
    transition,
    duration: transitionDuration,
    state: transitionStatus,
    timingFunction: transitionTimingFunction,
  })

  if (transitionStatus === "exited" && displayNone) {
    styles["display"] = "none"
  }

  return <>{children(styles)}</>
}
