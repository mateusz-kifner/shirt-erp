import { useEffect, useState } from "react"

import ApiList from "../../../components/api/ApiList"
import OrderListItem from "../orders/OrderListItem"
import { useRouter } from "next/router"
import { useTranslation } from "../../../i18n"
import { capitalize } from "lodash"
import { Box } from "@mantine/core"

const entryName = "order-archives"

interface OrderListProps {
  selectedId: number | null
}

const OrdersList = ({ selectedId }: OrderListProps) => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <ApiList
      ListItem={OrderListItem}
      entryName={entryName}
      label={
        <Box
          sx={(theme) => ({
            backgroundColor: theme.colors.orange[7] + "22",
            borderRadius: 2,
          })}
        >
          {entryName ? capitalize(t(`${entryName}.plural` as any)) : undefined}
        </Box>
      }
      selectedId={selectedId}
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
      filterKeys={["name", "notes"]}
      showAddButton
      exclude={{ name: "Szablon" }}
    />
  )
}

export default OrdersList