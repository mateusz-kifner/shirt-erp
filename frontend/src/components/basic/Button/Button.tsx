import { ButtonHTMLAttributes, DetailedHTMLProps } from "react"
import { TailwindColorNames } from "../../../types/TailwindColors"

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "filled" | "outline" | "ghost"
  color?: TailwindColorNames
}

const Button = (props: ButtonProps) => {
  const { variant = "filled", ...moreProps } = props
  return (
    <button className="btn" {...moreProps}>
      Button
    </button>
  )
}

export default Button
