import { Modal } from "@mantine/core"
import axios from "axios"
import { useEffect, useId, useState } from "react"
import { useQuery } from "react-query"
import { useRecoilState } from "recoil"
import { loginState } from "../atoms/loginState"
import simpleHash from "../utils/simpleHash"

const fetchWelcomeMessage = async () => {
  const res = await axios.get("/global")
  return res.data
}

const setWelcomeMessageHash = async (welcomeMessageHash: string) => {
  const res = await axios.put("/users-permissions/setWelcomeMessageHash", {
    welcomeMessageHash,
  })
  return res.data
}

const WelcomeMessage = () => {
  const [opened, setOpened] = useState<boolean>(true)
  const { data, refetch } = useQuery(["global"], fetchWelcomeMessage, {
    enabled: false,
  })
  const id = useId()
  const [login, setLogin] = useRecoilState(loginState)
  useEffect(() => {
    refetch()
  }, [])

  if (!data) return null
  const hash = simpleHash(data.data.welcomeMessage)
  console.log(login, hash)
  if (login?.user?.welcomeMessageHash === hash.toString()) return null

  return (
    <Modal
      opened={opened}
      onClose={async () => {
        setWelcomeMessageHash(hash.toString())
        setLogin((val) => {
          if (!val.user) return { ...val }
          return {
            ...val,
            user: { ...val.user, welcomeMessageHash: hash.toString() },
          }
        })
        setOpened(false)
      }}
    >
      <div>
        {data.data.welcomeMessage
          .split("\n")
          .map((val: string, index: number) => (
            <p key={id + index}>{val}</p>
          ))}
      </div>
    </Modal>
  )
}

export default WelcomeMessage
