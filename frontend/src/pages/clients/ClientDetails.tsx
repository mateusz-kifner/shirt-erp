import { FC, useEffect, useState } from "react"
import { message } from "antd"

import axios from "axios"
import Logger from "js-logger"
import { useQuery } from "react-query"

import EditComponent from "../../components/EditComponent"
import ErrorPage from "../ErrorPage"

import { ClientType } from "../../types/ClientType"

interface ClientDetailsProps {
  clientId?: number
  template: any
  onUpdate?: () => void
}

const fetchClient = async (id: number | undefined) => {
  if (!id) return
  const res = await axios.get(`/clients/${id}`)
  return res.data
}

const ClientDetails: FC<ClientDetailsProps> = ({
  clientId,
  template,
  onUpdate,
}) => {
  const [client, setClient] = useState<ClientType>()
  const [newTemplate, setNewTemplate] = useState<any>()

  const { data } = useQuery(["client_one", clientId], () =>
    fetchClient(clientId),
  )

  useEffect(() => {
    let new_template = { ...template }
    // console.log(client)
    client &&
      Object.keys(client).forEach((key) => {
        // console.log(key, new_template[key])

        // @ts-ignore
        if (client[key] != null) new_template[key].value = client[key]
        else new_template[key].value = new_template[key].initialValue
      })
    setNewTemplate(new_template)
  }, [template, client])
  useEffect(() => {
    if (!data) return
    setClient(data)
  }, [data])

  const onSubmit = (sub_data: Partial<ClientType>) => {
    axios
      .put(`/clients/${sub_data.id}`, sub_data)
      .then((res) => {
        Logger.info({ ...res, message: "Edycja klienta udana" })
        message.success("Edycja klienta udana")
        setClient(res.data)
        onUpdate && onUpdate()
      })
      .catch((e) => {
        Logger.error({ ...e, message: "Błąd edycji klienta" })
      })
  }

  const onDelete = (id: number) => {
    axios
      .delete(`/clients/${id}`)
      .then((res) => {
        Logger.info({ ...res, message: "Usuwanie klienta udane" })
        message.success("Usuwanie klienta udana")
        setClient(res.data)
        onUpdate && onUpdate()
      })
      .catch((e) => {
        Logger.error({ ...e, message: "Błąd usuwania klienta" })
      })
  }

  return (
    <div>
      {client ? (
        <EditComponent
          data={newTemplate}
          onSubmit={onSubmit}
          title="username"
          deleteTitle="Usuń Klienta"
          onDelete={onDelete}
        />
      ) : (
        <ErrorPage errorcode={404} />
      )}
    </div>
  )
}

export default ClientDetails
