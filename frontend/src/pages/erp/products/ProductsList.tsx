import React, { FC, ReactNode, useEffect, useState } from "react"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import ApiList from "../../../components/api/ApiList"
import DefaultListItem from "../../../components/DefaultListItem"
import ProductListItem from "./ProductListItem"
import _ from "lodash"
import names from "../../../models/names.json"
import { ProductType } from "../../../types/ProductType"

const entryName = "products"

interface ProductsListProps {
  // children?: ReactNode
}

const ProductsList: FC = () => {
  const [id, setId] = useState<number | null>(null)
  const navigate = useNavigate()
  const params = useParams()
  useEffect(() => {
    if (params?.id && parseInt(params.id) > 0) setId(parseInt(params.id))
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
      onChange={(val: any) => {
        console.log(val)
        setId(val.id)
        navigate("/erp/" + entryName + "/" + val.id)
      }}
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
      filterKeys={["name", "codeName"]}
    />
  )
}

export default ProductsList
