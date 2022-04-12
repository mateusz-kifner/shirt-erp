import { FC, useEffect, useState } from "react"
import { message } from "antd"

import axios from "axios"
import Logger from "js-logger"
import { useQuery } from "react-query"

import EditComponent from "../../components/EditComponent"
import ErrorPage from "../ErrorPage"
import { ProcedureType } from "../../types/ProcedureType"

interface ProcedureDetailsProps {
  procedureId?: number
  template: any
  onUpdate?: () => void
}

const fetchProcedure = async (id: number | undefined) => {
  if (!id) return
  const res = await axios.get(`/procedures/${id}`)
  return res.data
}

const ProcedureDetails: FC<ProcedureDetailsProps> = ({
  procedureId,
  template,
  onUpdate,
}) => {
  const [procedure, setProcedure] = useState<ProcedureType>()
  const [newTemplate, setNewTemplate] = useState<any>()

  const { data } = useQuery(["procedure_one", procedureId], () =>
    fetchProcedure(procedureId),
  )

  useEffect(() => {
    let new_template = { ...template }
    procedure &&
      Object.keys(procedure).forEach((key) => {
        // console.log(key)
        // @ts-ignore
        if (procedure[key] != null) new_template[key].value = procedure[key]
        else new_template[key].value = new_template[key].initialValue
      })
    setNewTemplate(new_template)
  }, [template, procedure])
  useEffect(() => {
    if (!data) return
    setProcedure(data)
  }, [data])

  const onSubmit = (sub_data: Partial<ProcedureType>) => {
    axios
      .put(`/procedures/${sub_data.id}`, sub_data)
      .then((res) => {
        Logger.info({ ...res, message: "Edycja procedury udana" })
        message.success("Edycja procedury udana")
        setProcedure(res.data)
        onUpdate && onUpdate()
      })
      .catch((e) => {
        Logger.error({ ...e, message: "Błąd edycji procedury" })
      })
  }

  return (
    <div>
      {procedure ? (
        <EditComponent data={newTemplate} onSubmit={onSubmit} title="name" />
      ) : (
        <ErrorPage errorcode={404} />
      )}
    </div>
  )
}

export default ProcedureDetails
