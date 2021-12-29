import { FC } from "react"
import { Typography } from "antd"
import {
  CloseOutlined,
  FileUnknownOutlined,
  LockOutlined,
} from "@ant-design/icons"

interface ErrorPageProps {
  errorcode: number
}

const { Title } = Typography

const ErrorPage: FC<ErrorPageProps> = ({ errorcode }) => {
  let errormessage = "000 - nieznany błąd"
  let erroricon = <CloseOutlined />
  switch (errorcode) {
    case 404:
      errormessage = "404 - nie znaleziono"
      erroricon = <FileUnknownOutlined />
      break
    case 403:
      errormessage = "403 - dostęp zabroniony"
      erroricon = <LockOutlined />
      break
  }
  return (
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
        <div style={{ fontSize: 64 }}>{erroricon}</div>
        <Title level={4}>{errormessage}</Title>
      </div>
    </div>
  )
}

export default ErrorPage
