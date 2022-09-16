import { FC } from "react"
import template from "../../../models/procedure.model.json"
import DefaultPage from "../../../components/DefaultPage"
import ProductionNavigation from "./ProductionNavigation"
import { makeDefaultListItem } from "../../../components/DefaultListItem"
import Workspace from "../../../components/layout/Workspace"
import { useRouter } from "next/router"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import ProceduresList from "./ProceduresList"

const entryName = "procedures"

const ProceduresPage: FC = () => {
  const router = useRouter()
  const id = getQueryAsIntOrNull(router, "id")
  const currentView = id ? [0, 1] : 0
  return (
    <>
      <ProductionNavigation defaultValue={entryName} />
      <Workspace
        childrenLabels={["Lista klientów", "Właściwości"]}
        childrenWrapperProps={[undefined, { style: { flexGrow: 1 } }]}
        defaultViews={currentView}
      >
        <ProceduresList selectedId={id} />
        <ApiEntryEditable template={template} entryName={entryName} id={id} />
      </Workspace>
    </>
  )
}

export default ProceduresPage
