import template from "../../../models/product.model.json"

import _ from "lodash"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import { useRouter } from "next/router"
import Workspace from "../../../components/layout/Workspace"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import ProductList from "./ProductsList"
import ProductAddModal from "./ProductAddModal"
import { useState } from "react"

const entryName = "products"

const ProductPage = () => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false)

  const router = useRouter()
  const id = getQueryAsIntOrNull(router, "id")
  const currentView = id ? [0, 1] : 0

  return (
    <>
      <Workspace
        childrenLabels={["Lista klientów", "Właściwości"]}
        defaultViews={currentView}
      >
        <ProductList
          selectedId={id}
          onAddElement={() => setOpenAddModal(true)}
        />
        <ApiEntryEditable template={template} entryName={entryName} id={id} />
      </Workspace>
      <ProductAddModal
        opened={openAddModal}
        onClose={() => setOpenAddModal(false)}
      />
    </>
  )
}

export default ProductPage
