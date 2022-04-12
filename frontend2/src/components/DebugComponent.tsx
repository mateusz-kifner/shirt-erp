import { FC, useEffect, useState } from "react"

import { v4 as uuidv4 } from "uuid"

const DebugComponent: FC<any> = (props) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    !(props.id || props.name) && setShow(true)
  }, [props])

  return (
    <div
      key={uuidv4()}
      style={{
        background: "#311",
        border: "3px solid red",
        borderRadius: "4px",
      }}
    >
      <div
        style={{
          minHeight: "40px",
          padding: 6,
          minWidth: 240,
          wordWrap: "break-word",
        }}
        onClick={() => (props.id || props.name) && setShow((val) => !val)}
      >
        {props.id && <span style={{ fontSize: "1.25em" }}>#{props.id}</span>}
        {props.name && <b style={{ fontSize: "1.25em" }}> {props.name}</b>}
      </div>
      {/* {(props.id || props.name) && <br />} */}
      <ul style={{ display: show ? "block" : "none" }}>
        {Object.keys(props).map((value: any, index: number) => (
          <li style={{ wordWrap: "break-word" }} key={uuidv4()}>
            {value === "data" || value === "user" ? (
              <>
                <span>{value}</span>
                <pre
                  style={{
                    height: "auto",
                    display: "block",
                    // overflow: "hidden",
                    padding: 10,
                    margin: 10,
                    background: "#111",
                  }}
                >
                  {JSON.stringify(props[value], null, 2)}
                </pre>
              </>
            ) : (
              <span>
                {value}: {props[value] && props[value].toString()}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DebugComponent
