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
    className,
    ...moreProps
  } = props
  return (
    <button
      className={`btn ${
        variant === "filled" ? `bg-${color}-600 hover:bg-${color}-700` : ""
      } ${
        variant === "outline"
          ? `border-2 border-solid text-${color}-600 border-${color}-600 hover:border-${color}-700 hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10`
          : ""
      } ${className}`}
      {...moreProps}
    >
      {!!leftSection && leftSection}
      {children}
      {!!rightSection && rightSection}
    </button>
  )
}

export default Button
