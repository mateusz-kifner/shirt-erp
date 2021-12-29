import { FC, useEffect, useState } from "react"
import {
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons"
import { Button, Input, Pagination, Tooltip, Typography } from "antd"

import axios from "axios"
import qs from "qs"
import { v4 as uuidv4 } from "uuid"
import { useQuery } from "react-query"

import DebugComponent from "../../components/DebugComponent"

import styles from "./LoggerPage.module.css"
import JsonParseModal from "./JsonParseModal"

const { Title } = Typography

const fetchClients = async (query: string) => {
  const res = await axios.get(`/logs?${query}`)
  console.log("req", query)
  return res.data
}

const LoggerPage: FC<{}> = () => {
  // const [clientId, setClientId] = useState<number>()
  // const [addVisible, setAddVisible] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [visible, setVisible] = useState<boolean>(false)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [query, setQuery] = useState<string>("_limit=10&_start=0")
  const [search, setSearch] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<boolean>(false)
  const { data, refetch } = useQuery(["logs", query], () => fetchClients(query))
  const { logs, count } = data ? data : { logs: [], count: 0 }

  useEffect(() => {
    let new_query: any = {
      _limit: itemsPerPage,
      _start: (page - 1) * itemsPerPage,
      _sort: `updated_at:${sortOrder ? "ASC" : "DESC"}`,
    }
    if (search.length > 0)
      new_query._or = [
        { message_contains: search },
        { data_contains: search },
        { type_contains: search },
      ]
    const new_query_string = qs.stringify(new_query)
    query != new_query_string && setQuery(new_query_string)
  }, [page, itemsPerPage, search, sortOrder])

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem 0",
        }}
      >
        <Title level={3}>Logi</Title>
        <Button onClick={() => setVisible((val) => !val)}>show Json</Button>
        <JsonParseModal visible={visible} onCancel={() => setVisible(false)} />
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
            {sortOrder ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
          </Button>
        </Tooltip>
      </div>
      {logs &&
        logs.map(
          (log: {
            id: number
            message: string | null
            type: string | null
            user: string | null
            data: string | null
          }) => (
            <DebugComponent
              key={uuidv4()}
              name={"#" + log.id + "  - " + log.type + " | " + log.message}
              data={log?.data}
              user={log?.user}
            />
          ),
        )}

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

export default LoggerPage
