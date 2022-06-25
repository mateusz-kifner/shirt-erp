import { useParams } from "react-router-dom"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import template from "../../../models/product.model.json"

const entryName = "products"

const ProductEditable = () => {
  const params = useParams()

  return (
    <ApiEntryEditable
      template={template}
      entryName={entryName}
      id={params.id ? parseInt(params.id) : null}
    />
  )
}

export default ProductEditable
