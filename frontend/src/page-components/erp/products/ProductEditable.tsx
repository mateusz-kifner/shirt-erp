import { useRouter } from "next/router"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import template from "../../../models/product.model.json"

const entryName = "products"

const ProductEditable = () => {
  const router = useRouter()

  const params = router.query

  return (
    <ApiEntryEditable
      template={template}
      entryName={entryName}
      id={
        params.id && typeof params.id === "string" ? parseInt(params.id) : null
      }
    />
  )
}

export default ProductEditable
