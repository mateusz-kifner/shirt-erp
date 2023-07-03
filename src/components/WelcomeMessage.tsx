import { Modal, TypographyStylesProvider } from "@mantine/core"
import axios from "axios"
import { lazy, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useAuthContext } from "../context/authContext"
import simpleHash from "../utils/simpleHash"
import Markdown from "./details/Markdown"

const fetchWelcomeMessage = async () => {
  const res = await axios.get("/global")
  return res.data
}

const mutateWelcomeMessageHash = async (welcomeMessageHash: string) => {
  const res = await axios.put("/users-permissions/setWelcomeMessageHash", {
    welcomeMessageHash,
  })
  return res.data
}

const WelcomeMessage = () => {
  const [opened, setOpened] = useState<boolean>(true)
  const { setWelcomeMessageHash, user } = useAuthContext()
  const { data, refetch } = useQuery(["global"], fetchWelcomeMessage, {
    enabled: false,
  })

  useEffect(() => {
    refetch()
    // eslint-disable-next-line
  }, [])

  if (!data) return null
  const hash = simpleHash(data.data.welcomeMessage)
  // console.log(login, hash)
  if (!user || user?.welcomeMessageHash === hash.toString()) return null

  return (
    <Modal
      opened={opened}
      onClose={async () => {
        mutateWelcomeMessageHash(hash.toString())
        setWelcomeMessageHash(hash.toString())
        setOpened(false)
      }}
      size="xl"
    >
      <TypographyStylesProvider>
        <Markdown value={data.data.welcomeMessage ?? ""} />
      </TypographyStylesProvider>
    </Modal>
  )
}

export default WelcomeMessage
