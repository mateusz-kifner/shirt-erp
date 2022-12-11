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
  const { variant = "filled", children, color = "blue", ...moreProps } = props
  return (
    <button
      className={`btn bg-${color}-600 hover:bg-${color}-700`}
      {...moreProps}
    >
      {children}
    </button>
  )
}

export default Button
