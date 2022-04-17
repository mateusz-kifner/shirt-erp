import { Prism } from "@mantine/prism"
import React from "react"

const InputNotImplemented = (props: any) => {
  return (
    <div>
      <Prism language="json">{JSON.stringify(props, null, 2)}</Prism>
    </div>
  )
}

export default InputNotImplemented
