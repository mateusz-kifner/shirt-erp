import { useEffect, useState } from "react"

import ApiList from "../../../components/api/ApiList"
import ProductListItem from "./ProductListItem"
import _ from "lodash"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"

const entryName = "products"

interface ProductListProps {
  selectedId: number | null
  onAddElement: () => void
}

const ProductsList = ({ selectedId, onAddElement }: ProductListProps) => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <ApiList
      ListItem={ProductListItem}
      entryName={entryName}
      label={
        entryName ? _.capitalize(t(`${entryName}.singular` as any)) : undefined
      }
      selectedId={selectedId}
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      // listItemProps={{
      //   linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      // }}
      filterKeys={["name"]}
      onAddElement={onAddElement}
      showAddButton
      exclude={{ username: "Szablon" }}
    />
  )
}

export default ProductsList
