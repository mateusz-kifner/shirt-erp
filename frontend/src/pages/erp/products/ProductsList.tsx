import React, { FC, ReactNode, useEffect, useState } from "react"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import ApiList from "../../../components/api/ApiList"
import DefaultListItem from "../../../components/DefaultListItem"
import ProductListItem from "../../../components/list_items/ProductListItem"
import _ from "lodash"
import names from "../../../templates/names.json"

const entryName = "products"

interface ProductsListProps {
  // children?: ReactNode
}

const ProductsList: FC<ProductsListProps> = ({}) => {
  const [id, setId] = useState<number | null>(null)
  const navigate = useNavigate()
  const params = useParams()
  useEffect(() => {
    if (params?.id && parseInt(params.id) > 0) setId(parseInt(params.id))
  })
  return (
    <>
      <ApiList
        ListItem={ProductListItem}
        entryName={entryName}
        // @ts-ignore
        label={_.capitalize(names[entryName].plural)}
        spacing="xl"
        listSpacing="sm"
        onChange={(val: any) => {
          console.log(val)
          setId(val.id)
          navigate("/erp/" + entryName + "/" + val.id)
        }}
        listItemProps={{
          linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
        }}
      />
    </>
  )
}

export default ProductsList
