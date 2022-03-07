import { FC } from "react"
import { Avatar, Card } from "antd"
import { LinkedListComponentType } from "../../types/LinkedListComponentType"
import axios from "axios"
import { useQuery } from "react-query"
import { WorkstationType } from "../../types/WorkstationType"
import { ArrowRightOutlined } from "@ant-design/icons"
import { serverURL } from "../.."

const { Meta } = Card

const fetchWorkstations = async () => {
  const res = await axios.get(`/workstations`)
  return res.data
}

interface WorkstationsIdsProps {
  workstationsIds: LinkedListComponentType[]
}

const WorkstationsIds: FC<WorkstationsIdsProps> = ({ workstationsIds }) => {
  const { data, refetch } = useQuery(["workstations"], () =>
    fetchWorkstations()
  )

  const workstations: WorkstationType[] = data?.workstations

  return (
    <div>
      {workstationsIds &&
      workstationsIds?.length > 0 &&
      workstations &&
      workstations?.length > 0 ? (
        workstationsIds.map(
          (workstationsId: LinkedListComponentType, index: number) => {
            if (workstationsId) {
              const prev = workstationsId.prevId
                ? workstations.filter(
                    (val) => val.id == workstationsId.prevId
                  )[0]
                : undefined
              const next = workstationsId.nextId
                ? workstations.filter(
                    (val) => val.id == workstationsId.nextId
                  )[0]
                : undefined
              return (
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    justifyItems: "center",
                  }}
                >
                  {prev ? (
                    <Card
                      key={"next" + workstationsId?.id + index}
                      style={{
                        margin: "0.5rem",
                        width: "100%",
                      }}
                    >
                      <Meta
                        avatar={
                          <Avatar
                            icon={
                              prev?.icon?.url && (
                                <img src={serverURL + prev?.icon?.url} alt="" />
                              )
                            }
                            // style={{ backgroundColor: workstation?.color?.colorHex }}
                          />
                        }
                        title={prev?.name}
                        description={prev?.desc}
                      />
                    </Card>
                  ) : (
                    <div style={{ padding: "1rem", width: "100%" }}>Brak</div>
                  )}
                  <ArrowRightOutlined />

                  {next ? (
                    <Card
                      key={next?.name + index}
                      style={{
                        margin: "0.5rem",
                        width: "100%",
                      }}
                    >
                      <Meta
                        avatar={
                          <Avatar
                            icon={
                              next?.icon?.url && (
                                <img src={serverURL + next?.icon?.url} alt="" />
                              )
                            }
                            // style={{ backgroundColor: workstation?.color?.colorHex }}
                          />
                        }
                        title={next?.name}
                        description={next?.desc}
                      />
                    </Card>
                  ) : (
                    <div style={{ padding: " 1rem ", width: "100%" }}>Brak</div>
                  )}
                </div>
              )
            }
          }
        )
      ) : (
        <div style={{ padding: "2rem" }}>Brak</div>
      )}
    </div>
  )
}

export default WorkstationsIds
