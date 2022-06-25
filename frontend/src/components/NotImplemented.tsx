import { Title } from "@mantine/core"
import { Prism } from "@mantine/prism"

const NotImplemented = (props: any) => {
  return (
    <div>
      <Title order={5}>
        Not implemented {props?.message ? " - " + props.message : ""}{" "}
      </Title>
      <div
        style={{
          overflow: "hidden",
          maxWidth: "100%",
          padding: "0",
          boxSizing: "border-box",
        }}
      >
        <Prism language="json">{JSON.stringify(props, null, 2)}</Prism>
      </div>
    </div>
  )
}

export default NotImplemented
