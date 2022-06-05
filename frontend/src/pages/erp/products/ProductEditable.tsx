import { useParams } from "react-router-dom"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import template from "../../../templates/product.template.json"

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
