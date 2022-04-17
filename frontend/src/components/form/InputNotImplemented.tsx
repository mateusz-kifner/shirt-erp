import { Title } from "@mantine/core"
import { Prism } from "@mantine/prism"
import React from "react"

const InputNotImplemented = (props: any) => {
  return (
    <div>
      <Title order={5}>Not implemented</Title>
      <Prism language="json">{JSON.stringify(props, null, 2)}</Prism>
    </div>
  )
}

export default InputNotImplemented
