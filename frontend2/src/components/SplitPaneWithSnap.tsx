import { FC, Children, useState } from "react"
import SplitPane from "react-split-pane"

import { v4 as uuidv4 } from "uuid"
import useWindowSize from "../hooks/useWindowSize"

import styles from "./SplitPaneWithSnap.module.css"

// FIXME: this element reloads chldren when props change

interface SplitPaneWithSnapProps {
  split?: "vertical" | "horizontal"
  minSize?: number
  defaultSize?: number
  gap: number
}

// function convertRemToPixels(rem: number) {
//   return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
// }

const SplitPaneWithSnap: FC<SplitPaneWithSnapProps> = ({
  split,
  minSize,
  defaultSize,
  children,
  gap = 0,
}) => {
  const [size, setSize] = useState(
    defaultSize ? 2 * gap + defaultSize + 6 : undefined,
  )
  const windowSize = useWindowSize()

  const onChange = (newSize: number) => {
    minSize &&
      setSize(
        Math.floor((newSize - gap) / (minSize + gap)) * (minSize + gap) +
          gap +
          6,
      )
  }

  const onClick = (event: MouseEvent) => {
    size && onChange(size)
  }

  return (
    <SplitPane
      split={split}
      minSize={minSize ? 2 * gap + minSize : undefined}
      defaultSize={defaultSize ? 2 * gap + defaultSize : undefined}
      className={styles.splitpane}
      onDragFinished={onChange}
      // onChange={onChange}
      size={size}
      onResizerClick={onClick}
      maxSize={
        split
          ? split === "vertical"
            ? windowSize.width * 0.7
            : windowSize.height * 0.7
          : windowSize.width * 0.7
      }
    >
      {children &&
        Children.toArray(children).map(
          (
            child: React.ReactChild | React.ReactFragment | React.ReactPortal,
          ) => (
            <div className={styles.pre_pane} key={uuidv4()}>
              <div className={styles.pane}>{child}</div>
            </div>
          ),
        )}
    </SplitPane>
  )
}

export default SplitPaneWithSnap
