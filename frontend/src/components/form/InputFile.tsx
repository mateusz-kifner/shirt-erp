import { FC } from "react"

interface InputFileProps {
  label?: string
  placeholder?: string
  value?: object
  onChange?: (value: object | null) => void
  disabled?: boolean
  required?: boolean
}
const InputFile: FC<InputFileProps> = ({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  required,
}) => {
  return <div>InputFile</div>
}

export default InputFile
