import { FC, useEffect, useState } from "react"
import {
  Box,
  Button,
  Group,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core"
import { loginState } from "../atoms/loginState"
import { useRecoilState } from "recoil"
import axios from "axios"
import { z } from "zod"
import { useModals } from "@mantine/modals"
import { useForm, zodResolver } from "@mantine/form"

const Loginschema = z.object({
  identifier: z.string().min(3, { message: "Musi mieć co najmniej 3 znaki" }),
  password: z.string().min(3, { message: "Musi mieć co najmniej 3 znaki" }),
})

const LoginPage: FC = () => {
  const modals = useModals()
  const openLoginModal = () =>
    modals.openConfirmModal({
      id: "Login_Modal",
      title: "Login",
      centered: true,
      children: <LoginModal />,
      groupProps: { style: { display: "none" } },
      labels: { confirm: "", cancel: "" },
      closeOnEscape: false,
      closeOnClickOutside: false,
      withCloseButton: false,
      closeOnConfirm: false,
      closeOnCancel: false,
    })
  useEffect(() => {
    openLoginModal()
    return () => {
      modals.closeModal("Login_Modal")
    }
  }, [])
  return <></>
}

const LoginModal = () => {
  const [login, setLogin] = useRecoilState(loginState)
  const [errorMessage, setErrorMessage] = useState(false)
  const form = useForm({
    schema: zodResolver(Loginschema),
    initialValues: { identifier: "", password: "" },
  })

  const onSubmit = (logindata: { identifier: string; password: string }) => {
    console.log("data", logindata)
    axios
      .post("/auth/local", logindata)
      .then(function (response) {
        setLogin(response.data)
        console.log(response)
      })
      .catch(function (error) {
        setErrorMessage(true)
        console.log(error)
      })
  }
  return (
    <Box sx={{ maxWidth: 340 }} mx="auto">
      <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
        <TextInput
          label="Nazwa użytkownika"
          placeholder=""
          mt="sm"
          {...form.getInputProps("identifier")}
        />
        <PasswordInput
          label="Hasło"
          placeholder=""
          mt="sm"
          {...form.getInputProps("password")}
        />
        <Group position="right" mt="xl">
          <Button type="submit">Zaloguj</Button>
        </Group>
      </form>
    </Box>
  )
}

export default LoginPage
