import { FC } from "react"
import { Tabs, TabsValue } from "@mantine/core"
import { Affiliate, Robot } from "tabler-icons-react"
import { useRouter } from "next/router"

const ProductionNavigation: FC<{ defaultValue?: string }> = ({
  defaultValue = "procedures",
}) => {
  const router = useRouter()
  return (
    <Tabs
      variant="outline"
      onTabChange={(tabKey?: TabsValue) => {
        router.push("/erp/" + tabKey)
      }}
      defaultValue={defaultValue}
      styles={(theme) => ({
        tabsList: {
          paddingLeft: theme.spacing.lg,
          paddingRight: theme.spacing.lg,
          paddingTop: theme.spacing.xs,
        },
      })}
    >
      <Tabs.List>
        <Tabs.Tab icon={<Robot size={14} />} value="workstations">
          Stanowiska pracy
        </Tabs.Tab>
        <Tabs.Tab icon={<Affiliate size={14} />} value="procedures">
          Procedury
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  )
}

export default ProductionNavigation
