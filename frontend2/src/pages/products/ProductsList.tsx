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

import { useQuery } from "react-query"
import axios from "axios"
import qs from "qs"

import { ProductType } from "../../types/ProductType"
import ProductAddModal from "./ProductAddModal"

import styles from "../../styles/List.module.css"
import { serverURL } from "../.."
import { StrapiGeneric } from "../../types/StrapiResponse"

const { Title } = Typography

const fetchProducts = async (query: string) => {
  const res = await axios.get(`/products?${query}`)
  // console.log("req", query)
  return res.data
}

export interface ProductsListHandle {
  refetch?: () => void
}

interface ProductsListProps {
  onItemClickId?: (id: number) => void
  onItemClick?: (product: ProductType) => void
  template: any
}
const ProductsList = forwardRef<ProductsListHandle, ProductsListProps>(
  ({ onItemClickId, onItemClick, template }, ref) => {
    const [productId, setProductId] = useState<number>()
    const [addVisible, setAddVisible] = useState(false)
    const [page, setPage] = useState<number>(1)
    const [itemsPerPage, setItemsPerPage] = useState<number>(10)
    const [query, setQuery] = useState<string>(
      "_limit=10&_start=0&_sort=updatedAt%3ADESC"
    )
    const [search, setSearch] = useState<string>("")
    const [sortOrder, setSortOrder] = useState<boolean>(false)
    const { data, refetch } = useQuery(["products", query], () =>
      fetchProducts(query)
    )
    const { products, count } = data
      ? {
          products: data.data.map((val: StrapiGeneric) => ({
            ...val.attributes,
            id: val.id,
          })),
          count: data.meta.pagination.total,
        }
      : { products: [], count: 0 }

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
          { codeName_contains: search },
          { desc_contains: search },
          { category_contains: search },
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
          <Title level={3}>Produkty</Title>
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
            <Tooltip title="Dodaj produkt">
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
          </Space>
          <ProductAddModal
            visible={addVisible}
            setVisible={setAddVisible}
            data={template}
            title="Dodaj nowy produkt"
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
          dataSource={products}
          renderItem={(product: ProductType) => (
            <List.Item
              onClick={() => {
                onItemClickId && onItemClickId(product.id)
                onItemClick && onItemClick({ ...product })
                setProductId(product.id)
              }}
              className={styles.item}
              style={{
                backgroundColor:
                  product.id === productId ? "var(--background2)" : undefined,
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={
                      product?.icon?.url && (
                        <img
                          src={serverURL + product?.icon?.url}
                          alt={product?.category}
                        />
                      )
                    }
                    style={{ backgroundColor: product?.color?.colorHex }}
                  />
                }
                title={product?.name}
                description={product?.codeName}
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

export default ProductsList
