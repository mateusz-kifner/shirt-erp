import { Title } from "@mantine/core"

const NotImplemented = (props: any) => {
  return (
    <div
      style={{
        border: "1px solid #f23",
        borderRadius: 4,
        margin: 4,
        padding: 4,
      }}
    >
      <Title order={5}>
        Not implemented {props?.message ? " - " + props.message : ""}{" "}
      </Title>
      <code
        style={{
          overflow: "hidden",
          maxWidth: "100%",
          padding: "0",
          boxSizing: "border-box",
          whiteSpace: "pre",
        }}
      >
        {JSON.stringify(props, null, 2)}
      </code>
    </div>
  )
}

export default NotImplemented
