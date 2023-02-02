import { ActionIcon } from "@mantine/core"
import { merge } from "lodash"
import React, { CSSProperties, ReactNode, useId } from "react"

interface FloatingActionsProps {
  actions: (() => void)[]
  actionIcons: ReactNode[]
  actionsVisible?: boolean[]
  style?: CSSProperties
}

const FloatingActions = (props: FloatingActionsProps) => {
  const { actions, actionIcons, actionsVisible, style = {} } = props
  const uuid = useId()
  return (
    <div
      style={merge(
        {
          position: "absolute",
          top: 0,
          right: 0,
        },
        style
      )}
    >
      {actions.map((action, index) => {
        if (
          actionsVisible &&
          actionsVisible.length > index &&
          actionsVisible[index] === false
        ) {
          return null
        }
        if (index === 0) {
          return (
            <ActionIcon
              key={uuid + "_" + index}
              onClick={action}
              size="xl"
              radius={9999}
              sx={{
                position: "fixed",

                transition: "transform 200ms ease-in-out",
                "&:hover": {
                  transform: "translate(-10px, 0)",
                },
                "&:after": {
                  content: "''",
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: "50%",
                },
              }}
              variant="default"
            >
              {actionIcons.length > index
                ? actionIcons[index]
                : actionIcons[actionIcons.length - 1]}
            </ActionIcon>
          )
        }
        return (
          <ActionIcon
            key={uuid + "_" + index}
            onClick={action}
            size="md"
            radius={9999}
            style={{
              position: "fixed",
              marginTop: 16 + index * 38,
              marginLeft: 8,
            }}
            variant="default"
          >
            {actionIcons.length > index
              ? actionIcons[index]
              : actionIcons[actionIcons.length - 1]}
          </ActionIcon>
        )
      })}
    </div>
  )
}

export default FloatingActions
