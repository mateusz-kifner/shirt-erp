import { UpCircleOutlined } from "@ant-design/icons"
import { Button, Collapse, Tooltip, Typography } from "antd"
import axios from "axios"
import { FC } from "react"
import { useQuery } from "react-query"
import { useRecoilState } from "recoil"
import { taskState } from "../../atoms/activeTasks"
import { OrderType } from "../../types/OrderType"
import { StrapiGeneric } from "../../types/StrapiResponse"
import { status_colors, status_icons } from "../orders/OrdersList"
import TaskDetails from "./TaskDetails"

const { Title } = Typography

const { Panel } = Collapse

const fetchTasks = async () => {
  const res = await axios.get(`/users/me`)
  return res.data
}

const TasksPage: FC = () => {
  const [openTasks, setOpenTasks] = useRecoilState(taskState)
  const { data, refetch } = useQuery(["user_me"], () => fetchTasks())
  const orders_incomplete = data?.data
    ? data?.data.map((val: StrapiGeneric) => ({
        ...val.attributes,
        id: val.id,
      }))
    : []
  return (
    <div
      style={{
        backgroundColor: "var(--background1)",
        maxHeight: "100%",
        height: "100%",
        borderRadius: "0.5rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflowY: "scroll",
          backgroundColor: "var(--background0)",
        }}
      >
        <div>
          <div
            style={{
              padding: "1rem 2rem",
              borderBottom: "1px solid var(--gray)",
              margin: 0,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Title level={3}>Zadania</Title>
            <Tooltip title="Zamknij wszytkie">
              <Button
                type="primary"
                shape="circle"
                onClick={() => setOpenTasks([])}
              >
                <UpCircleOutlined />
              </Button>
            </Tooltip>
          </div>
          <Collapse
            activeKey={openTasks}
            onChange={(key: string[] | string) => {
              if (typeof key !== "string") setOpenTasks(key as string[])
            }}
            bordered={false}
          >
            {orders_incomplete &&
              orders_incomplete.length > 0 &&
              orders_incomplete
                .filter(
                  (order: OrderType) =>
                    //not odrzucone and archiwizowane
                    !(
                      order.status == "odrzucone" ||
                      order.status == "archiwizowane"
                    )
                )
                .map((order: OrderType, index: number) => (
                  <Panel
                    header={
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "1.6rem",
                            height: "1.6rem",
                            fontSize: "1rem",
                            textAlign: "center",
                            borderRadius: "100%",
                            color: "#111",
                            backgroundColor:
                              status_colors[
                                order.status.replace(
                                  " ",
                                  "_"
                                ) as keyof typeof status_icons
                              ],
                          }}
                        >
                          {
                            status_icons[
                              order.status.replace(
                                " ",
                                "_"
                              ) as keyof typeof status_icons
                            ]
                          }
                        </div>
                        {order.name}
                      </div>
                    }
                    key={"tasks" + index}
                  >
                    <TaskDetails orderId={order.id} onChange={refetch} />
                  </Panel>
                ))}
          </Collapse>
          {orders_incomplete && orders_incomplete.length == 0 && (
            <div>Brak zadań</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TasksPage
