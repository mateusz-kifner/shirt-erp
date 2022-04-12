// import {FC, useState } from "react"
// import {
//   Avatar,
//   Button,
//   Input,
//   List,
//   Pagination,
//   Tooltip,
//   Typography,
// } from "antd"
// import styles from "./ItemList.module.css"
// import {
//   PlusOutlined,
//   SearchOutlined,
//   SortAscendingOutlined,
// } from "@ant-design/icons"
// // import useApi from "../hooks/useApi"

// const { Title } = Typography
// const { Search } = Input

// interface ItemListProps {
//   onItemClick: (id: number) => void
//   title: string
//   addButtonLabel?: string
//   renderModal: (props: any) => React.ReactNode
//   template: ItemProps[]
//   api_url: string
// }

// interface ItemProps {
//   title: string
//   desc: string
//   id: number
//   avatarText?: string
//   avatarImage?: string
// }

// const ItemList: FC<ItemListProps> = ({
//   title,
//   addButtonLabel,
//   template,
//   renderModal,
//   onItemClick,
//   api_url,
// }) => {
//   const [addModalVisible, setAddModalVisible] = useState(false)
//   // const { data, goToPage, maxPage, itemsPerPage, setSearch } = useApi<any>(
//   //   api_url,
//   //   10,
//   // )
//   console.log(maxPage)
//   return (
//     <div>
//       <div className={styles.header}>
//         <Title level={3}>{title}</Title>
//         <Tooltip title={addButtonLabel ? addButtonLabel : "Dodaj " + title}>
//           <Button
//             icon={<PlusOutlined />}
//             shape="circle"
//             type="primary"
//             onClick={() => {
//               setAddModalVisible(true)
//             }}
//           />
//         </Tooltip>
//         {renderModal({
//           visible: addModalVisible,
//           setVisible: setAddModalVisible,
//         })}
//       </div>
//       <div className={styles.header}>
//         <Input
//           // className={styles.search}
//           suffix={<SearchOutlined />}
//           defaultValue=""
//           onChange={(e) => {
//             let value = e.target.value
//             console.log({
//               _or: [
//                 { firstname_contains: value },
//                 { lastname_contains: value },
//               ],
//             })
//             value.length > 0
//               ? setSearch({
//                   _or: [
//                     { firstname_contains: value },
//                     { lastname_contains: value },
//                   ],
//                 })
//               : setSearch({})
//           }}
//         />
//         <Tooltip title={"Zmień sortowanie"}>
//           <Button disabled={true}>
//             <SortAscendingOutlined />
//           </Button>
//         </Tooltip>
//       </div>
//       <List
//         className={styles.list}
//         itemLayout="horizontal"
//         dataSource={data.map((val) => ({ ...val, title: val.firstname }))}
//         renderItem={(item: ItemProps) => (
//           <List.Item
//             onClick={() => onItemClick(item.id)}
//             className={styles.item}
//           >
//             <List.Item.Meta
//               avatar={
//                 <Avatar
//                   icon={
//                     item.avatarText ? (
//                       <div>{item.avatarText}</div>
//                     ) : (
//                       item.avatarImage && <img src={item.avatarImage} />
//                     )
//                   }
//                 />
//               }
//               title={item.title}
//               description={item.desc}
//             />
//           </List.Item>
//         )}
//       />
//       <Pagination
//         className={styles.pagination}
//         defaultCurrent={1}
//         total={maxPage * itemsPerPage}
//         pageSize={itemsPerPage}
//         showSizeChanger={false}
//         showQuickJumper={false}
//         onChange={goToPage}
//       />
//     </div>
//   )
// }

// export default ItemList

const ItemList = () => {
  return <div></div>
}

export default ItemList
