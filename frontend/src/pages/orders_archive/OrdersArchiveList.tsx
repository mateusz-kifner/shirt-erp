import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import {
  ArrowRightOutlined,
  CalendarOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  CarOutlined,
  CloseOutlined,
  ContainerOutlined,
  FormatPainterOutlined,
  GiftOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import {
  Avatar,
  Button,
  Input,
  List,
  Pagination,
  Space,
  Tooltip,
  Typography,
} from "antd"

import { useQuery } from "react-query"
import axios from "axios"
import qs from "qs"
import { v4 as uuidv4 } from "uuid"

import { OrderType } from "../../types/OrderType"

import styles from "../../styles/List.module.css"
import { StrapiGeneric } from "../../types/StrapiResponse"

const { Title } = Typography

export const status_icons = {
  planowane: <CalendarOutlined />,
  zaakceptowane: <ArrowRightOutlined />,
  w_produkcji: <FormatPainterOutlined />,
  zapakowane: <GiftOutlined />,
  wysłane: <CarOutlined />,
  odrzucone: <CloseOutlined />,
  archiwizowane: <ContainerOutlined />,
}

export const status_colors = {
  planowane: "#F8E71C",
  zaakceptowane: "#7ED321",
  w_produkcji: "#4A90E2",
  zapakowane: "#8B572A",
  wysłane: "#417505",
  odrzucone: "#D0021B",
  archiwizowane: "#F5A623",
}

const fetchOrders = async (query: string) => {
  const res = await axios.get(`/order-archives?${query}`)
  // console.log("req", query)
  return res.data
}

export interface OrdersArchiveListHandle {
  refetch?: () => void
}

interface OrdersArchiveListProps {
  onItemClickId?: (id: number) => void
  onItemClick?: (order: OrderType) => void
  template: any
}
const OrdersArchiveList = forwardRef<
  OrdersArchiveListHandle,
  OrdersArchiveListProps
>(({ onItemClickId, onItemClick, template }, ref) => {
  const [orderId, setOrderId] = useState<number>()
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [query, setQuery] = useState<string>(
    "_limit=10&_start=0&_sort=updatedAt%3ADESC"
  )
  const [search, setSearch] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<boolean>(false)
  const { data, refetch } = useQuery(["orders-archives", query], () =>
    fetchOrders(query)
  )
  const { orders, count } = data
    ? {
        orders: data.data.map((val: StrapiGeneric) => ({
          ...val.attributes,
          id: val.id,
        })),
        count: data.meta.pagination.total,
      }
    : { orders: [], count: 0 }

  useImperativeHandle(
    ref,
    () => ({
      refetch,
    }),
    [refetch]
  )

  useEffect(() => {
    let new_query: any = {
      _limit: itemsPerPage,
      _start: (page - 1) * itemsPerPage,
      _sort: `updatedAt:${sortOrder ? "ASC" : "DESC"}`,
    }
    if (search.length > 0)
      new_query._or = [
        { name_contains: search },
        { status_contains: search },
        { notes_contains: search },
      ]
    const new_query_string = qs.stringify(new_query)
    query !== new_query_string && setQuery(new_query_string)
  }, [page, itemsPerPage, search, sortOrder])

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0.5rem 0",
        }}
      >
        <Title
          level={3}
          style={{
            backgroundColor: "#F8E71C",
            color: "#333",
            padding: "0.5rem",
            margin: "0",
          }}
        >
          Zamówienia Archiwizowane&nbsp;
          <CalendarOutlined />
        </Title>
        <Space>
          <Tooltip title="Odśwież">
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              shape="circle"
              onClick={() => {
                refetch()
              }}
            />
          </Tooltip>
        </Space>
      </div>
      <div className={styles.header}>
        <Input
          // className={styles.search}
          suffix={<SearchOutlined />}
          defaultValue=""
          onChange={(e) => {
            setSearch(e.target.value)
          }}
        />
        <Tooltip title={"Zmień sortowanie"}>
          <Button
            onClick={() => {
              setSortOrder((val) => !val)
              refetch()
            }}
          >
            {sortOrder ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Button>
        </Tooltip>
      </div>
      <List
        className={styles.list}
        itemLayout="horizontal"
        dataSource={orders}
        renderItem={(order: OrderType) => (
          <List.Item
            onClick={() => {
              onItemClickId && onItemClickId(order.id)
              onItemClick && onItemClick({ ...order })
              setOrderId(order.id)
            }}
            className={styles.item}
            style={{
              backgroundColor:
                order.id === orderId ? "var(--background2)" : undefined,
            }}
            key={uuidv4()}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={
                    status_icons[
                      order.status.replace(
                        " ",
                        "_"
                      ) as keyof typeof status_icons
                    ]
                  }
                  style={{
                    color: "#111",
                    backgroundColor:
                      status_colors[
                        order.status.replace(
                          " ",
                          "_"
                        ) as keyof typeof status_icons
                      ],
                  }}
                />
              }
              title={order.name}
              description={order.status}
            />
          </List.Item>
        )}
      />
      <Pagination
        className={styles.pagination}
        defaultCurrent={1}
        total={count}
        pageSize={itemsPerPage}
        showSizeChanger={false}
        showQuickJumper={false}
        onChange={(page: number, pageSize?: number) => {
          setPage(page)
          pageSize && setItemsPerPage(pageSize)
        }}
      />
    </div>
  )
})

export default OrdersArchiveList
