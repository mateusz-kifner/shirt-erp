import { FC, useEffect, useState } from "react"
import { message } from "antd"

import axios from "axios"
import Logger from "js-logger"
import { useQuery } from "react-query"

import EditComponent from "../../components/EditComponent"
import ErrorPage from "../ErrorPage"

import { UserType } from "../../types/UserType"

interface UserDetailsProps {
  userId?: number
  template: any
  onUpdate?: () => void
}

const fetchUser = async (id: number | undefined) => {
  if (!id) return
  const res = await axios.get(`/users/${id}`)
  return res.data
}

const UserDetails: FC<UserDetailsProps> = ({ userId, template, onUpdate }) => {
  const [user, setUser] = useState<UserType>()
  const [newTemplate, setNewTemplate] = useState<any>()

  const { data } = useQuery(["user_one", userId], () => fetchUser(userId))

  useEffect(() => {
    let new_template = { ...template }
    user &&
      Object.keys(user).forEach((key) => {
        // @ts-ignore
        if (user[key] != null) new_template[key].value = user[key]
        else new_template[key].value = new_template[key].initialValue
      })
    setNewTemplate(new_template)
  }, [template, user])
  useEffect(() => {
    if (!data) return
    setUser(data)
  }, [data])

  const onSubmit = (sub_data: Partial<UserType>) => {
    axios
      .put(`/users/${sub_data.id}`, sub_data)
      .then((res) => {
        Logger.info({ ...res, message: "Edycja klienta udana" })
        message.success("Edycja klienta udana")
        setUser(res.data)
        onUpdate && onUpdate()
      })
      .catch((e) => {
        Logger.error({ ...e, message: "Błąd edycji klienta" })
      })
  }

  return (
    <div>
      {user ? (
        <EditComponent
          data={newTemplate}
          onSubmit={onSubmit}
          title="username"
        />
      ) : (
        <ErrorPage errorcode={404} />
      )}
    </div>
  )
}

export default UserDetails
