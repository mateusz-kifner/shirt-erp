import { ButtonHTMLAttributes, DetailedHTMLProps } from "react"
import { TailwindColorNames } from "../../../../tailwind.types"

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "filled" | "outline" | "ghost"
  color?: TailwindColorNames
}

const Button = (props: ButtonProps) => {
  const { variant = "filled", children, ...moreProps } = props
  return (
    <button className="btn" {...moreProps}>
      {children}
    </button>
  )
}

export default Button
