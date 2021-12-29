import { FC, useEffect, useState } from "react"
import { message } from "antd"

import axios from "axios"
import Logger from "js-logger"
import { useQuery } from "react-query"

import EditComponent from "../../components/EditComponent"
import ErrorPage from "../ErrorPage"

import { WorkstationType } from "../../types/WorkstationType"

interface WorkstationDetailsProps {
  workstationId?: number
  template: any
  onUpdate?: () => void
}

const fetchWorkstation = async (id: number | undefined) => {
  if (!id) return
  const res = await axios.get(`/workstations/${id}`)
  return res.data
}

const WorkstationDetails: FC<WorkstationDetailsProps> = ({
  workstationId,
  template,
  onUpdate,
}) => {
  const [workstation, setWorkstation] = useState<WorkstationType>()
  const [newTemplate, setNewTemplate] = useState<any>()

  const { data } = useQuery(["workstation_one", workstationId], () =>
    fetchWorkstation(workstationId),
  )

  useEffect(() => {
    let new_template = { ...template }
    workstation &&
      Object.keys(workstation).forEach((key) => {
        // @ts-ignore
        if (workstation[key] != null) new_template[key].value = workstation[key]
        else new_template[key].value = new_template[key].initialValue
      })
    setNewTemplate(new_template)
  }, [template, workstation])
  useEffect(() => {
    if (!data) return
    setWorkstation(data)
  }, [data])

  const onSubmit = (sub_data: Partial<WorkstationType>) => {
    axios
      .put(`/workstations/${sub_data.id}`, sub_data)
      .then((res) => {
        Logger.info({ ...res, message: "Edycja stanowiska udana" })
        message.success("Edycja stanowiska udana")
        setWorkstation(res.data)
        onUpdate && onUpdate()
      })
      .catch((e) => {
        Logger.error({ ...e, message: "Błąd edycji stanowiska" })
      })
  }

  return (
    <div>
      {workstation ? (
        <EditComponent data={newTemplate} onSubmit={onSubmit} title="name" />
      ) : (
        <ErrorPage errorcode={404} />
      )}
    </div>
  )
}

export default WorkstationDetails
