import { Title } from "@mantine/core"
import { Prism } from "@mantine/prism"

const NotImplemented = (props: any) => {
  return (
    <div>
      <Title order={5}>
        Not implemented {props?.message ? " - " + props.message : ""}{" "}
      </Title>
      <Prism language="json">{JSON.stringify(props, null, 2)}</Prism>
    </div>
  )
}

export default NotImplemented
