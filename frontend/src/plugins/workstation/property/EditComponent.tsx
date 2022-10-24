import { FC } from "react"

interface EditComponentProps {
  config: object
  onSubmit: (config: object) => void
}

const EditComponent = ({ config, onSubmit }: EditComponentProps) => {
  return <div>EditComponent</div>
}

export default EditComponent
