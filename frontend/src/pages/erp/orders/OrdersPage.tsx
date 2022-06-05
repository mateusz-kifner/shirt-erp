import { FC, useEffect } from "react"

import template from "../../../templates/order.template.json"
import OrderListItem from "../../../components/list_items/OrderListItem"
import DefaultPage from "../../../components/DefaultPage"
import CalcTable from "../../../components/CalcTable"
import * as XLSX from "xlsx"
import EditableTable from "../../../components/editable/EditableTable"
import { atom, useRecoilState } from "recoil"

const sheetState = atom<any>({
  key: "sheet",
  default: [[{ value: null }]],
})
const OrdersPage: FC = () => {
  const [sheet, setSheet] = useRecoilState(sheetState)
  // const presidents = [
  //   { name: "George Washington", birthday: "1732-02-22" },
  //   { name: "John Adams", birthday: "1735-10-19" },
  //   // ... one row per President
  // ]
  // useEffect(() => {
  //   const worksheet = XLSX.utils.json_to_sheet(presidents)
  //   const workbook = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Dates")
  //   // XLSX.writeFile(workbook, "Presidents.xlsx")
  // })
  console.log(sheet)

  return (
    // <CalcTable />
    <EditableTable
      value={sheet}
      onSubmit={(data) => {
        setSheet(data)
        console.log(data)
      }}
    />
    // <DefaultPage
    //   template={template}
    //   ListElement={OrderListItem}
    //   entryName="orders"
    // />
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
