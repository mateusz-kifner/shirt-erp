import { FC, useState } from "react"
import {
  Box,
  Button,
  Group,
  Modal,
  PasswordInput,
  TextInput,
} from "@mantine/core"
import axios from "axios"
import { useForm } from "@mantine/form"
import { useAuthContext } from "../context/authContext"

const LoginModal = () => {
  const { signIn } = useAuthContext()

  const [errorMessage, setErrorMessage] = useState(false)
  const form = useForm({
    initialValues: { identifier: "", password: "" },
    validate: {
      identifier: (value) =>
        value.length < 3 ? "Musi mieć co najmniej 3 znaki" : null,
      password: (value) =>
        value.length < 3 ? "Musi mieć co najmniej 3 znaki" : null,
    },
  })

  const onSubmit = (loginData: { identifier: string; password: string }) => {
    console.log("data", loginData)
    axios
      .post("/auth/local", loginData)
      .then(function (response) {
        signIn(response.data)
      })
      .catch(function (error) {
        setErrorMessage(true)
        console.log(error)
      })
  }
  return (
    <Box sx={{ maxWidth: 340 }} mx="auto">
      {errorMessage && "Logowanie nie udane"}
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

const Login: FC = () => {
  return (
    <Modal opened={true} onClose={() => {}}>
      <LoginModal />
    </Modal>
  )
}

export default Login
