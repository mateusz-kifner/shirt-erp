import React from "react"
import { OrderType } from "../../../types/OrderType"

interface TaskViewProps {
  order: Partial<OrderType> | null
}

const TaskView = (props: TaskViewProps) => {
  const { order } = props
  return <div>{order?.name}</div>
}

export default TaskView
