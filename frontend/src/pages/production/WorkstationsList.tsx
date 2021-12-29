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

import WorkstationAddModal from "./WorkstationAddModal"

import { WorkstationType } from "../../types/WorkstationType"

import styles from "../../styles/List.module.css"

const { Title } = Typography
const serverURL = process.env.REACT_APP_SERVER_URL || "http://localhost:1337"

const fetchWorkstations = async (query: string) => {
  const res = await axios.get(`/workstations?${query}`)
  // console.log("req", query)
  return res.data
}

export interface WorkstationsListHandle {
  refetch?: () => void
}

interface WorkstationsListProps {
  onItemClickId?: (id: number) => void
  onItemClick?: (workstation: WorkstationType) => void
  template: any
  hideAdd?: boolean
}
const WorkstationsList = forwardRef<
  WorkstationsListHandle,
  WorkstationsListProps
>(({ onItemClickId, onItemClick, template, hideAdd }, ref) => {
  const [workstationId, setWorkstationId] = useState<number>()
  const [addVisible, setAddVisible] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [query, setQuery] = useState<string>(
    "_limit=10&_start=0&_sort=updated_at%3ADESC",
  )
  const [search, setSearch] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<boolean>(false)
  const { data, refetch } = useQuery(["workstations", query], () =>
    fetchWorkstations(query),
  )
  const { workstations, count } = data ? data : { workstations: [], count: 0 }

  useImperativeHandle(
    ref,
    () => ({
      refetch,
    }),
    [refetch],
  )

  useEffect(() => {
    let new_query: any = {
      _limit: itemsPerPage,
      _start: (page - 1) * itemsPerPage,
      _sort: `updated_at:${sortOrder ? "ASC" : "DESC"}`,
    }
    if (search.length > 0)
      new_query._or = [{ name_contains: search }, { desc_contains: search }]
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
        <Title level={3}>Stanowiska</Title>
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
            <Tooltip title="Dodaj stanowisko">
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
        <WorkstationAddModal
          visible={addVisible}
          setVisible={setAddVisible}
          data={template}
          title="Dodaj nowe stanowisko"
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
        dataSource={workstations}
        renderItem={(workstation: WorkstationType) => (
          <List.Item
            onClick={() => {
              onItemClickId && onItemClickId(workstation.id)
              onItemClick && onItemClick({ ...workstation })
              setWorkstationId(workstation.id)
            }}
            className={styles.item}
            style={{
              backgroundColor:
                workstation.id === workstationId
                  ? "var(--background2)"
                  : undefined,
            }}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={
                    workstation?.icon?.url && (
                      <img src={serverURL + workstation?.icon?.url} alt="" />
                    )
                  }
                  // style={{ backgroundColor: workstation?.color?.colorHex }}
                />
              }
              title={workstation.name}
              description={workstation.desc}
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

export default WorkstationsList
