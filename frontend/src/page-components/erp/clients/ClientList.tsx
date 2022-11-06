import ApiList from "../../../components/api/ApiList"
import ClientListItem from "./ClientListItem"
import { useRouter } from "next/router"
import { useTranslation } from "../../../i18n"
import { capitalize } from "lodash"

const entryName = "clients"

interface ClientListProps {
  selectedId: number | null
  onAddElement?: () => void
}

const ClientsList = ({ selectedId, onAddElement }: ClientListProps) => {
  // const [id, setId] = useState<number | null>(null)
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <ApiList
      ListItem={ClientListItem}
      entryName={entryName}
      label={
        entryName ? capitalize(t(`${entryName}.plural` as any)) : undefined
      }
      selectedId={selectedId}
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
      filterKeys={["username", "firstname", "email", "companyName"]}
      onAddElement={onAddElement}
      showAddButton
      exclude={{ username: "Szablon" }}
    />
  )
}

export default ClientsList
