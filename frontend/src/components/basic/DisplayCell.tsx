import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react"
import { TailwindColorNames } from "../../../tailwind.types"

interface DisplayCellProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  variant?: "filled" | "outline" | "ghost"
  color?: TailwindColorNames
  rightSection?: ReactNode
  leftSection?: ReactNode
  children?: ReactNode
  label?: ReactNode
  disabled?: boolean
}

const DisplayCell = (props: DisplayCellProps) => {
  const {
    variant,
    color = "primary",
    rightSection,
    leftSection,
    children,
    label,
    disabled,
    ...moreProps
  } = props
  return (
    <div>
      <div className="text-sm">{!!label && label}</div>
      <div className={`display-cell bg-${color}-600`} data-disabled={disabled}>
        {!!leftSection ? leftSection : <div></div>}
        <div className="w-full">{children}</div>
        {!!rightSection && rightSection}
      </div>
    </div>
  )
}

export default DisplayCell
