import { FC } from "react"
import { Form, Card, Button } from "antd"
import {
  ArrowRightOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import { LinkedListComponentType } from "../../types/LinkedListComponentType"
import { WorkstationIdPicker } from "./InputWorkstationId"
import { NumericLiteral } from "typescript"

const serverURL = (import.meta.env.SERVER_URL ||
  (function () {
    let origin_split = window.location.origin.split(":")
    return `${origin_split[0]}:${origin_split[1]}:1337/api`
  })()) as string

interface InputWorkstationsIdsComponentsProps {
  name: string
  initialValue?: LinkedListComponentType[]
  label: string
  disabled?: boolean
  required?: boolean
}

const InputWorkstationsIdsComponents: FC<
  InputWorkstationsIdsComponentsProps
> = ({ name, label, disabled, required, initialValue }) => {
  return (
    <Form.Item
      name={name}
      // label={label}
      initialValue={initialValue}
      rules={[{ required: required }]}
      wrapperCol={{ span: undefined }}
    >
      {/* @ts-ignore */}
      <WorkstationsIdsComponentsPicker label={label} />
    </Form.Item>
  )
}

interface OnChangeHandler {
  (e: Partial<LinkedListComponentType | null>[]): void
}
interface WorkstationComponentsPickerProps {
  value: Partial<LinkedListComponentType | null>[]
  onChange: OnChangeHandler
  label: string
}
const WorkstationsIdsComponentsPicker: FC<WorkstationComponentsPickerProps> = ({
  value,
  onChange,
  label,
}) => {
  return (
    <Card
      style={{ width: "100%" }}
      size="small"
      title={<span>{label}</span>}
      bodyStyle={{
        display: "flex",
        gap: "0.25rem",
        padding: "0.rem",
        flexDirection: "column",
      }}
    >
      {value &&
        value.map(
          (
            workstationIds: Partial<LinkedListComponentType> | null,
            index: number
          ) => (
            <>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <WorkstationIdPicker
                  value={workstationIds?.prevId ? workstationIds?.prevId : null}
                  onChange={(workstationId) => {
                    onChange([
                      ...value.map(
                        (
                          val: Partial<LinkedListComponentType | null>,
                          i: number
                        ) => {
                          if (index == i && val) {
                            let newVal = { ...val }
                            newVal.prevId = workstationId
                            return newVal
                          }
                          return val
                        }
                      ),
                    ])
                  }}
                />
                {workstationIds?.prevId || workstationIds?.nextId ? (
                  <ArrowRightOutlined />
                ) : (
                  <Button
                    danger
                    type="primary"
                    onClick={() =>
                      onChange([
                        ...value.filter(
                          (
                            val: Partial<LinkedListComponentType | null>,
                            i: number
                          ) => {
                            if (index == i) {
                              return false
                            }
                            return true
                          }
                        ),
                      ])
                    }
                  >
                    <DeleteOutlined />
                  </Button>
                )}
                <WorkstationIdPicker
                  value={workstationIds?.nextId ? workstationIds?.nextId : null}
                  onChange={(workstationId) => {
                    onChange([
                      ...value.map(
                        (
                          val: Partial<LinkedListComponentType | null>,
                          i: number
                        ) => {
                          if (index == i && val) {
                            let newVal = { ...val }
                            newVal.nextId = workstationId
                            return newVal
                          }
                          return val
                        }
                      ),
                    ])
                  }}
                />
              </div>
              <hr />
            </>
          )
        )}
      <Button
        onClick={() =>
          value
            ? onChange([
                ...value,
                {
                  prevId: null,
                  nextId: null,
                },
              ])
            : onChange([
                {
                  prevId: null,
                  nextId: null,
                },
              ])
        }
        type="primary"
      >
        <PlusOutlined />
      </Button>
    </Card>
  )
}

export default InputWorkstationsIdsComponents
