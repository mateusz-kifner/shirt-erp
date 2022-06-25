import { FC } from "react"
import { Tabs } from "@mantine/core"
import { Affiliate, Robot } from "../../../utils/TablerIcons"
import { useNavigate } from "react-router-dom"

const ProductionNavigation: FC<{ initialTab?: number }> = ({
  initialTab = 0,
}) => {
  const navigate = useNavigate()
  return (
    <Tabs
      variant="outline"
      onTabChange={(_: number, tabKey?: string) => {
        navigate("/erp/" + tabKey)
      }}
      initialTab={initialTab}
      styles={(theme) => ({
        tabsList: {
          paddingLeft: theme.spacing.lg,
          paddingRight: theme.spacing.lg,
          paddingTop: theme.spacing.xs,
        },
      })}
    >
      <Tabs.Tab
        label="Stanowiska pracy"
        icon={<Robot size={14} />}
        tabKey="workstations"
      ></Tabs.Tab>
      <Tabs.Tab
        label="Procedury"
        icon={<Affiliate size={14} />}
        tabKey="procedures"
      ></Tabs.Tab>
    </Tabs>
  )
}

export default ProductionNavigation
