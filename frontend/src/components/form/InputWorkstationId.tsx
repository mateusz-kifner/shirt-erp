import { FC, useEffect, useState } from "react"
import { Form, Card, Modal, Button, Avatar } from "antd"
import { DeleteFilled } from "@ant-design/icons"

import WorkstationsList from "../../pages/production/WorkstationsList"
import { workstation_template } from "../../pages/production/WorkstationsPage"

import { WorkstationType } from "../../types/WorkstationType"
import { LinkedListComponentType } from "../../types/LinkedListComponentType"
import axios from "axios"
import { useQuery } from "react-query"
import useEffectOnce from "../../hooks/useEffectOnce"

const { Meta } = Card
const serverURL = process.env.REACT_APP_SERVER_URL || "http://localhost:1337"

interface InputWorkstationIdProps {
  name: string
  initialValue?: number
  label: string
  disabled?: boolean
  required?: boolean
}

const InputWorkstationId: FC<InputWorkstationIdProps> = ({
  name,
  label,
  disabled,
  required,
  initialValue,
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      initialValue={initialValue}
      rules={[{ required: required }]}
    >
      {/* @ts-ignore */}
      <WorkstationIdPicker />
    </Form.Item>
  )
}

const fetchWorkstations = async () => {
  const res = await axios.get(`/workstations`)
  // console.log("req", query)
  return res.data
}

interface OnChangeHandler {
  (e: number | null): void
}
interface WorkstationIdPickerProps {
  value: number | null
  onChange: OnChangeHandler
}
export const WorkstationIdPicker: FC<WorkstationIdPickerProps> = ({
  value,
  onChange,
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [currentWorkstation, setCurrentWorkstation] =
    useState<Partial<WorkstationType>>()
  const { data, refetch } = useQuery(
    ["workstations"],
    () => fetchWorkstations(),
    {
      enabled: false,
    },
  )

  useEffectOnce(() => {
    refetch()
  })

  useEffect(() => {
    if (data?.workstations) {
      let current = data?.workstations.filter(
        (w: WorkstationType) => w.id == value,
      )
      if (current.length > 0) setCurrentWorkstation(current[0])
    }
  }, [data])

  // console.log("workstationid input", value)
  return (
    <>
      <Modal
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => {
          currentWorkstation?.id && onChange(currentWorkstation.id)
          setModalOpen(false)
        }}
      >
        <WorkstationsList
          template={workstation_template}
          onItemClick={setCurrentWorkstation}
        />
      </Modal>
      <div style={{ position: "relative", width: "100%" }}>
        <Button style={{ height: "100%", width: "100%", padding: 0 }}>
          <Card
            onClick={() => setModalOpen(true)}
            style={{ height: "100%", width: "100%" }}
          >
            {currentWorkstation ? (
              <Meta
                avatar={
                  <Avatar
                    icon={
                      currentWorkstation?.icon?.url && (
                        <img
                          src={serverURL + currentWorkstation?.icon?.url}
                          alt=""
                        />
                      )
                    }
                  />
                }
                title={currentWorkstation?.name}
                description={currentWorkstation?.desc}
              />
            ) : (
              <Meta title="Brak" />
            )}
          </Card>
        </Button>
        {currentWorkstation && (
          <Button
            onClick={() => {
              onChange(null)
              setCurrentWorkstation(undefined)
            }}
            style={{ position: "absolute", right: 0, top: 0, height: "100%" }}
          >
            <DeleteFilled />
          </Button>
        )}
      </div>
    </>
  )
}

export default InputWorkstationId
