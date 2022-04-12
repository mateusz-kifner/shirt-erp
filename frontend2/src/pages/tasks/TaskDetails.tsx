import { message, Select, Spin } from "antd"
import axios from "axios"
import Logger from "js-logger"
import { FC } from "react"
import { useQuery } from "react-query"
import { validateLocaleAndSetLanguage } from "typescript"
import DetailsComponent from "../../components/DetailsComponent"
import ProductComponentsTable from "../../components/ProductComponentsTable"
import { OrderType } from "../../types/OrderType"
import { ProductComponentType } from "../../types/ProductComponentType"
import { ReloadOutlined } from "@ant-design/icons"

const antIcon = <ReloadOutlined style={{ fontSize: 36 }} spin />
const { Option } = Select

const fetchOrder = async (id: number | undefined) => {
  if (!id) return
  const res = await axios.get(`/orders/${id}`)
  return res.data
}

interface TaskDetailsProps {
  orderId: number
  onChange: () => void
}

const TaskDetails: FC<TaskDetailsProps> = ({ orderId, onChange }) => {
  const { data, refetch, isLoading, isRefetching } = useQuery(
    ["order_one" + orderId, orderId],
    () => fetchOrder(orderId)
  )
  const updatePartialOrder = (id: number, updateData: Partial<OrderType>) => {
    axios
      .put(`/orders/${id}`, updateData)
      .then((res) => {
        Logger.info({ ...res, message: "Edycja zamowienia udana" })
        message.success("Edycja zamówienia udana")
        refetch()
        onChange()
      })
      .catch((e) => {
        Logger.error({ ...e, message: "Błąd edycji zamówienia" })
      })
  }

  const details_data: any = {
    // status: {
    //   label: "Status",
    //   type: "enum",
    //   value: data?.status,
    //   enum_data: [
    //     "planowane",
    //     "zaakceptowane",
    //     "w produkcji",
    //     "zapakowane",
    //     "wysłane",
    //     "odrzucone",
    //     "archiwizowane",
    //   ],
    // },

    notes: {
      label: "Notatki",
      type: "string",
      value: data?.notes,
    },
    files: {
      label: "Pliki",
      type: "files",
      value: data?.files,
    },
    client: {
      label: "Klient",
      type: "client",
      value: data?.client,
      // disabled: true
    },
    dateOfCompletion: {
      label: "Data ukończenia",
      type: "date",
      value: data?.dateOfCompletion,
    },
  }

  return (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          // justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span>Status: </span>
        {data?.status && (
          <Select
            defaultValue={data?.status}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={(value) => {
              updatePartialOrder(orderId, { status: value })
              // console.log(value)
            }}
            style={{ width: "20rem" }}
          >
            {[
              "planowane",
              "zaakceptowane",
              "w produkcji",
              "zapakowane",
              "wysłane",
              "odrzucone",
              "archiwizowane",
            ].map((value: string) => (
              <Option value={value} key={value}>
                {value}
              </Option>
            ))}
          </Select>
        )}
      </div>
      {data?.products && (
        <div style={{ position: "relative" }}>
          <ProductComponentsTable
            productComponents={data.products}
            onChange={(id) => {
              updatePartialOrder(orderId, {
                products: data.products.map((val: ProductComponentType) => {
                  if (val.id != id) return val
                  return { ...val, ready: !val.ready }
                }),
              })
            }}
          />
          {isLoading ||
            (isRefetching && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  zIndex: 100,
                }}
              >
                <Spin
                  size="large"
                  style={{
                    position: "absolute",
                    top: "20%",
                    left: "50%",
                    transform: "translate(-50%,0)",
                  }}
                  indicator={antIcon}
                ></Spin>
              </div>
            ))}
        </div>
      )}
      {details_data && <DetailsComponent data={details_data} />}
    </div>
  )
}

export default TaskDetails
