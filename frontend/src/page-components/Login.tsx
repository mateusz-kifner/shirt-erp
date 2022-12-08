import { useEffect, useState } from "react"
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
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const { signIn } = useAuthContext()

  const [errorMessage, setErrorMessage] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

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
    <Modal opened={isLoaded} onClose={() => {}}>
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
          <div className="flex flex-row gap-3 justify-end mt-4">
            <Button type="submit">Zaloguj</Button>
          </div>
        </form>
      </Box>
    </Modal>
  )
}

export default LoginModal
