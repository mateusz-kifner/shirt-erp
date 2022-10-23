import { Button, Group, Stack, Tooltip, useMantineTheme } from "@mantine/core"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import Spreadsheet, { Matrix } from "react-spreadsheet"
import { ColorSwatch, RulerMeasure, Shirt, TextSize } from "tabler-icons-react"
import TableCenterIcon from "../../../components/icons/TableCenterIcon"
import TableEdgeIcon from "../../../components/icons/TableEdgeIcon"

const index = () => {
  const theme = useMantineTheme()

  const { t } = useTranslation()
  const [data, setData] = useState<Matrix<any>>([
    [{ value: "" }, { value: "" }, { value: "" }],
    [{ value: "" }, { value: "" }, { value: "" }],
    [{ value: "" }, { value: "" }, { value: "" }],
  ])
  const [selection, setSelection] = useState<
    { row: number; column: number }[] | null
  >(null)
  console.log(data, selection)

  return (
    <Stack
      onBlur={() => setSelection(null)}
      spacing={0}
      style={{ height: "100%" }}
    >
      <Group p="xs">
        <Button.Group>
          <Tooltip label={t("add-row-top")} withinPortal withArrow>
            <Button variant="default" p={0} size="xs">
              <TableEdgeIcon
                action_color={theme.colors.green[6]}
                size={28}
                stroke={1.2}
                style={{ transform: "rotate(-90deg)" }}
              />
            </Button>
          </Tooltip>
          <Tooltip label={t("add-row-bottom")} withinPortal withArrow>
            <Button variant="default" p={0} size="xs">
              <TableEdgeIcon
                action_color={theme.colors.green[6]}
                size={28}
                stroke={1.2}
                style={{ transform: "rotate(90deg)" }}
              />
            </Button>
          </Tooltip>

          <Tooltip label={t("add-column-left")} withinPortal withArrow>
            <Button variant="default" p={0} size="xs">
              <TableEdgeIcon
                action_color={theme.colors.green[6]}
                size={28}
                stroke={1.2}
                style={{ transform: "scale(-1)" }}
              />
            </Button>
          </Tooltip>

          <Tooltip label={t("add-column-right")} withinPortal withArrow>
            <Button variant="default" p={0} size="xs">
              <TableEdgeIcon
                action_color={theme.colors.green[6]}
                size={28}
                stroke={1.2}
              />
            </Button>
          </Tooltip>
        </Button.Group>
        <Button.Group>
          <Tooltip label={t("remove-column")} withinPortal withArrow>
            <Button variant="default" p={0} size="xs">
              <TableCenterIcon
                action_color={theme.colors.red[6]}
                size={28}
                stroke={1.2}
                style={{ transform: "rotate(-90deg)" }}
                action_position="center"
              />
            </Button>
          </Tooltip>

          <Tooltip label={t("remove-row")} withinPortal withArrow>
            <Button variant="default" p={0} size="xs">
              <TableCenterIcon
                action_color={theme.colors.red[6]}
                size={28}
                stroke={1}
                action_position="center"
              />
            </Button>
          </Tooltip>
        </Button.Group>

        <Button.Group>
          <Button variant="default" p={0} size="xs">
            <ColorSwatch />
          </Button>
          <Button variant="default" p={0} size="xs">
            <RulerMeasure />
          </Button>
        </Button.Group>
      </Group>
      <Spreadsheet
        data={data}
        onChange={setData}
        onSelect={(value) => value.length != 0 && setSelection(value)}
        darkMode={theme.colorScheme === "dark"}
        className="Spreadsheet"
      />
    </Stack>
  )
}

export default index
