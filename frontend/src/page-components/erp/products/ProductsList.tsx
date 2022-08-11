import { FC, useEffect, useState } from "react"

import ApiList from "../../../components/api/ApiList"
import ProductListItem from "./ProductListItem"
import _ from "lodash"
import names from "../../../models/names.json"
import { ProductType } from "../../../types/ProductType"
import { useRouter } from "next/router"

const entryName = "products"

interface ProductsListProps {
  // children?: ReactNode
}

const ProductsList: FC = () => {
  const [id, setId] = useState<number | null>(null)
  const router = useRouter()
  const params = router.query
  useEffect(() => {
    if (typeof params?.id === "string" && parseInt(params.id) > 0)
      setId(parseInt(params.id))
  })
  return (
    <ApiList<ProductType>
      ListItem={ProductListItem}
      entryName={entryName}
      label={
        entryName && entryName in names
          ? _.capitalize(names[entryName as keyof typeof names].plural)
          : undefined
      }
      spacing="xl"
      listSpacing="sm"
      onChange={(val) => {
        console.log(val)
        setId(val.id)
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      listItemProps={{
        linkTo: (val: ProductType) => "/erp/" + entryName + "/" + val.id,
      }}
      filterKeys={["name", "codeName"]}
    />
  )
}

export default ProductsList
