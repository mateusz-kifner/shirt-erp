import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import {
  CaretDownOutlined,
  CaretUpOutlined,
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

import axios from "axios"
import qs from "qs"
import { useQuery } from "react-query"

import ClientAddModal from "./ClientAddModal"

import { ClientType } from "../../types/ClientType"

import styles from "../../styles/List.module.css"
import { StrapiGeneric } from "../../types/StrapiResponse"

const { Title } = Typography

const fetchClients = async (query: string) => {
  const res = await axios.get(`/clients?${query}`)
  // console.log("req", query)
  return res.data
}

export interface ClientsListHandle {
  refetch?: () => void
}

interface ClientsListProps {
  onItemClickId?: (id: number) => void
  onItemClick?: (client: ClientType) => void
  template: any
  hideAdd?: boolean
}
const ClientsList = forwardRef<ClientsListHandle, ClientsListProps>(
  ({ onItemClickId, onItemClick, template, hideAdd }, ref) => {
    const [clientId, setClientId] = useState<number>()
    const [addVisible, setAddVisible] = useState(false)
    const [page, setPage] = useState<number>(1)
    const [itemsPerPage, setItemsPerPage] = useState<number>(10)
    const [query, setQuery] = useState<string>(
      "_limit=10&_start=0&_sort=updatedAt%3ADESC"
    )
    const [search, setSearch] = useState<string>("")
    const [sortOrder, setSortOrder] = useState<boolean>(false)
    const { data, refetch } = useQuery(["clients", query], () =>
      fetchClients(query)
    )
    const { clients, count } = data
      ? {
          clients: data.data.map((val: StrapiGeneric) => ({
            ...val.attributes,
            id: val.id,
          })),
          count: data.meta.pagination.total,
        }
      : { clients: [], count: 0 }

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
          { firstname_contains: search },
          { lastname_contains: search },
          { username_contains: search },
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
            padding: "1rem 0",
          }}
        >
          <Title level={3}>Klienci</Title>
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
            {!hideAdd && (
              <Tooltip title="Dodaj klienta">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  // size="large"
                  shape="circle"
                  onClick={() => {
                    setAddVisible(true)
                  }}
                />
              </Tooltip>
            )}
          </Space>
          <ClientAddModal
            visible={addVisible}
            setVisible={setAddVisible}
            data={template}
            title="Dodaj nowego klienta"
            onUpdate={refetch}
          />
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
          dataSource={clients}
          renderItem={(client: ClientType) => (
            <List.Item
              onClick={() => {
                onItemClickId && onItemClickId(client.id)
                onItemClick && onItemClick({ ...client })
                setClientId(client.id)
              }}
              className={styles.item}
              style={{
                backgroundColor:
                  client.id === clientId ? "var(--background2)" : undefined,
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={
                      (client.firstname ? client.firstname[0] : "") +
                      (client.lastname ? client.lastname[0] : "")
                    }
                  />
                }
                title={
                  (client.firstname ? client.firstname : "") +
                  " " +
                  (client.lastname ? client.lastname : "") +
                  (client.companyName && client.companyName?.length > 0
                    ? ` (${client.companyName})`
                    : "")
                }
                description={
                  client.username +
                  (client.email && client.email?.length > 0
                    ? ` (${client.email})`
                    : "")
                }
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
  }
)

export default ClientsList
