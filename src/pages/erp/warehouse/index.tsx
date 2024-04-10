import ApiList from "@/components/ApiList/ApiList";

const columns = [
  { accessorKey: "id", label: "Id" },
  { accessorKey: "name", label: "Nazwa" },
  { accessorKey: "unitPrice", label: "Cena jednostkowa" },
];

interface WarehousePageProps {}

function WarehousePage(props: WarehousePageProps) {
  const {} = props;

  return (
    <div>
      <ApiList entryName="product" columnDef={columns} />
      {/* <img
        src="/assets/cardboard-box-with-lid-svgrepo-com.svg"
        className="h-64 w-64"
      /> */}
    </div>
  );
}

export default WarehousePage;
