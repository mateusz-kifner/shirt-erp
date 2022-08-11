import ClientView from "../../../page-components/erp/clients/ClientView"

const ClientsPage = ({ id }: { id: number | null }) => {
  return <ClientView id={id} />
}

export default ClientsPage
