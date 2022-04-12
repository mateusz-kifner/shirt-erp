import { FC, useEffect, useState } from "react"

import EditComponent from "../../components/EditComponent"
import ErrorPage from "../ErrorPage"

import { ClientType } from "../../types/ClientType"
import useStrapi from "../../hooks/useStrapi"

interface ClientDetailsProps {
  clientId?: number
  template: any
  onUpdate?: () => void
}

const ClientDetails: FC<ClientDetailsProps> = ({
  clientId,
  template,
  onUpdate,
}) => {
  const [client, setClient] = useState<ClientType>()
  const [newTemplate, setNewTemplate] = useState<any>()
  const { data, status, refetch, update, remove } = useStrapi(
    "clients",
    clientId,
    {
      updateMutationOptions: {
        errorMessage: "Błąd edycji klienta",
        successMessage: "Edycja klienta udana",
        onSuccess: onUpdate,
      },
      removeMutationOptions: {
        errorMessage: "Błąd usuwania klienta",
        successMessage: "Usuwanie klienta udane",
        onSuccess: () => {
          onUpdate && onUpdate()
          setClient(undefined)
        },
      },
    }
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
    setClient({ ...data.data.attributes, id: data.data.id })
  }, [data])

  return (
    <div>
      {client ? (
        <EditComponent
          data={newTemplate}
          onSubmit={update}
          title="username"
          deleteTitle="Usuń Klienta"
          onDelete={remove}
        />
      ) : (
        <ErrorPage errorcode={404} />
      )}
    </div>
  )
}

export default ClientDetails
