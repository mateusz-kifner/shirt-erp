import template from "../../../models/product.model.json"

import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import { useRouter } from "next/router"
import Workspace from "../../../components/layout/Workspace"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import ProductList from "./ProductsList"
import ProductAddModal from "./ProductAddModal"
import { useState } from "react"
import { List, Notebook } from "tabler-icons-react"

const entryName = "products"

const ProductPage = () => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false)

  const router = useRouter()
  const id = getQueryAsIntOrNull(router, "id")
  const currentView = id ? [0, 1] : 0

  return (
    <>
      <Workspace
        childrenLabels={
          id ? ["Lista produktów", "Właściwości"] : ["Lista produktów"]
        }
        childrenIcons={[List, Notebook]}
      >
        <ProductList
          selectedId={id}
          onAddElement={() => setOpenAddModal(true)}
        />
        <ApiEntryEditable template={template} entryName={entryName} id={id} />
      </Workspace>
      <ProductAddModal
        opened={openAddModal}
        onClose={(id) => {
          setOpenAddModal(false)
          id !== undefined &&
            router.push(`/erp/products/${id}?pinned=0&active=1`)
        }}
      />
    </>
  )
}

export default ProductPage
