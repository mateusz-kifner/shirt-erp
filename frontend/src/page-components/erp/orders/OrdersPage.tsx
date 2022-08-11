import { FC, useEffect, useState } from "react"

import template from "../../../models/order.model.json"
import OrderListItem from "./OrderListItem"
import DefaultPage from "../../../components/DefaultPage"
import CalcTable from "../../../components/CalcTable"
import * as XLSX from "xlsx"
import EditableTable from "../../../components/editable/EditableTable"
import TableType from "../../../types/TableType"
import Editable from "../../../components/editable/Editable"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import Workspace from "../../../components/layout/Workspace"
import OrdersList from "./OrdersList"
import ApiList from "../../../components/api/ApiList"
import _ from "lodash"
import names from "../../../models/names.json"
import { useRouter } from "next/router"
import { createEmptyMatrix, Matrix } from "react-spreadsheet"

const entryName = "orders"

const OrdersPage: FC = () => {
  // const [sheet, setSheet] = useState<TableType>({
  //   name: "test",
  //   data: [[{ value: "" }]],
  // })
  const [sheet, setSheet] = useState<TableType>({
    name: "Arkusz 1",
    data: createEmptyMatrix(10, 10),
  })
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
  // console.log(sheet)

  const [id, setId] = useState<number | null>(null)
  const router = useRouter()
  return (
    // <AdvancedWorkspace>
    <Workspace
      childrenWrapperProps={[undefined, { style: { flexGrow: 1 } }]}
      childrenLabels={["Lista zamówień", "Właściwości"]}
      currentPage={id ? 1 : 0}
    >
      <ApiList
        ListItem={OrderListItem}
        entryName={entryName}
        label={
          entryName && entryName in names
            ? _.capitalize(names[entryName as keyof typeof names].plural)
            : undefined
        }
        spacing="xl"
        listSpacing="sm"
        selectedId={id}
        onChange={(val: any) => {
          console.log(val)
          setId(val.id)
          router.push("/erp/" + entryName + "/" + val.id)
        }}
        listItemProps={{
          linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
        }}
        filterKeys={["name", "status"]}
      />

      <>
        <ApiEntryEditable template={template} entryName={"orders"} id={1} />
        <EditableTable
          value={sheet}
          onSubmit={(data) => {
            data && setSheet(data)
            console.log(data)
          }}
        />
      </>
    </Workspace>
    // </AdvancedWorkspace>
    // <CalcTable />
    // <EditableTable
    //   value={sheet}
    //   onSubmit={(data) => {
    //     setSheet(data)
    //     console.log(data)
    //   }}
    // />
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
// // import OrderListItem from "../../../components/list_items/OrderListItem"
// import names from "../../../models/names.json"
// import _ from "lodash"
// import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
// import template from "../../../models/order.model.json"

// const entryName = "orders"

// const OrdersPage: FC = () => {
//   const [id, setId] = useState<number | null>(null)
//   const router = useRouter()

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
//           label={entryName && entryName in names && _.capitalize(names[entryName as keyof typeof names].plural)}
//           spacing="xl"
//           listSpacing="sm"
//           onChange={(val: any) => {
//             console.log(val)
//             setId(val.id)
//             router.push("/erp/" + entryName + "/" + val.id)
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
