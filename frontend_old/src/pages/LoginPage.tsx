import { FC, useState } from "react"
import {
  Box,
  Button,
  Group,
  Modal,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core"
import { loginState } from "../atoms/loginState"
import { useRecoilState } from "recoil"
import axios from "axios"
import { z } from "zod"
import { useForm, zodResolver } from "@mantine/form"

const loginSchema = z.object({
  identifier: z.string().min(3, { message: "Musi mieć co najmniej 3 znaki" }),
  password: z.string().min(3, { message: "Musi mieć co najmniej 3 znaki" }),
})

const LoginPage: FC = () => {
  return (
    <Modal opened={true} onClose={() => {}}>
      <LoginModal />
    </Modal>
  )
}

const LoginModal = () => {
  const [login, setLogin] = useRecoilState(loginState)
  const [errorMessage, setErrorMessage] = useState(false)
  const form = useForm({
    schema: zodResolver(loginSchema),
    initialValues: { identifier: "", password: "" },
  })

  const onSubmit = (loginData: { identifier: string; password: string }) => {
    console.log("data", loginData)
    axios
      .post("/auth/local", loginData)
      .then(function (response) {
        setLogin(response.data.data)
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
