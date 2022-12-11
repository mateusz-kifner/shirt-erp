import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react"
import { TailwindColorNames } from "../../../tailwind.types"

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "filled" | "outline" | "ghost"
  color?: TailwindColorNames
  rightSection?: ReactNode
  leftSection?: ReactNode
}

const Button = (props: ButtonProps) => {
  const {
    variant = "filled",
    children,
    color = "blue",
    rightSection,
    leftSection,
    ...moreProps
  } = props
  return (
    <button
      className={`btn bg-${color}-600 hover:bg-${color}-700`}
      {...moreProps}
    >
      {!!leftSection && leftSection}
      {children}
      {!!rightSection && rightSection}
    </button>
  )
}

export default Button
