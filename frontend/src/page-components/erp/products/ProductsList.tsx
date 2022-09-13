import { FC, useEffect, useState } from "react"

import ApiList from "../../../components/api/ApiList"
import ProductListItem from "./ProductListItem"
import _ from "lodash"
import names from "../../../models/names.json"
import { useRouter } from "next/router"

const entryName = "products"
const label =
  entryName && entryName in names
    ? _.capitalize(names[entryName as keyof typeof names].plural)
    : undefined

interface ProductListProps {
  selectedId: number | null
  onAddElement: () => void
}

const ProductsList = ({ selectedId, onAddElement }: ProductListProps) => {
  const router = useRouter()

  return (
    <ApiList
      ListItem={ProductListItem}
      entryName={entryName}
      label={label}
      selectedId={selectedId}
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      // listItemProps={{
      //   linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      // }}
      filterKeys={["name", "codeName"]}
      onAddElement={onAddElement}
      showAddButton
    />
  )
}

export default ProductsList
