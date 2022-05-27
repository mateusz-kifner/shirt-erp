import { FC } from "react"

interface EditComponentProps {
  config: object
  onSubmit: (config: object) => void
}

const EditComponent: FC<EditComponentProps> = ({ config, onSubmit }) => {
  return <div>EditComponent</div>
}

export default EditComponent
