import { FC } from "react"

import template from "../../../templates/order.template.json"
import OrderListItem from "../../../components/list_items/OrderListItem"
import DefaultPage from "../../../components/DefaultPage"

const OrdersPage: FC = () => {
  return (
    <DefaultPage
      template={template}
      ListElement={OrderListItem}
      entryName="orders"
    />
  )
}

export default OrdersPage

// import { FC, useState } from "react"
// import { Group } from "@mantine/core"
// import ResponsivePaper from "../../../components/ResponsivePaper"
// import ApiList from "../../../components/api/ApiList"
// import { useNavigate } from "react-router-dom"
// import OrderListItem from "../../../components/list_items/OrderListItem"
// import names from "../../../templates/names.json"
// import _ from "lodash"
// import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
// import template from "../../../templates/order.template.json"

// const entryName = "orders"

// const OrdersPage: FC = () => {
//   const [id, setId] = useState<number | null>(null)
//   const navigate = useNavigate()

//   return (
//     <Group
//       sx={(theme) => ({
//         flexWrap: "nowrap",
//         alignItems: "flex-start",
//         padding: theme.spacing.xl,
//         [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
//           padding: 0,
//         },
//       })}
//     >
//       <ResponsivePaper>
//         <ApiList
//           ListItem={OrderListItem}
//           entryName={entryName}
//           // @ts-ignore
//           label={_.capitalize(names[entryName].plural)}
//           spacing="xl"
//           listSpacing="sm"
//           onChange={(val: any) => {
//             console.log(val)
//             setId(val.id)
//             navigate("/erp/" + entryName + "/" + val.id)
//           }}
//         />
//       </ResponsivePaper>
//       <ResponsivePaper style={{ flexGrow: 1 }}>
//         <ApiEntryEditable template={template} entryName={entryName} id={id} />
//       </ResponsivePaper>
//     </Group>
//   )
// }

// export default OrdersPage
