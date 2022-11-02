import { useEffect } from "react"
import { useRemark } from "react-remark"

interface MarkdownProps {
  value: string
}

const MarkdownSSR = (props: MarkdownProps) => {
  const { value } = props
  const [reactContent, setMarkdownSource] = useRemark()

  useEffect(() => {
    setMarkdownSource(value)
  }, [value])

  return reactContent
}

export default MarkdownSSR
