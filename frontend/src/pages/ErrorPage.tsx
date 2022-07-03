import { FC } from "react"
import { Text, TypographyStylesProvider } from "@mantine/core"
import { Title } from "@mantine/core"
import { X, FileUnknown, Lock } from "tabler-icons-react"

interface ErrorPageProps {
  errorcode: number
}

const ErrorPage: FC<ErrorPageProps> = ({ errorcode }) => {
  let errormessage = "000 - nieznany błąd"
  let erroricon = <X />
  switch (errorcode) {
    case 404:
      errormessage = "404 - nie znaleziono"
      erroricon = <FileUnknown />
      break
    case 403:
      errormessage = "403 - dostęp zabroniony"
      erroricon = <Lock />
      break
  }
  return (
    <TypographyStylesProvider>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "3rem",
          borderRadius: "0.5rem",
          backgroundColor: "var(--background0)",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 128 }}>{erroricon}</div>
          <Title order={4}>{errormessage}</Title>
        </div>
      </div>
    </TypographyStylesProvider>
  )
}

export default ErrorPage
