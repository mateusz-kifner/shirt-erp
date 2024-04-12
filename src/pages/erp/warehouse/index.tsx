import ApiList from "@/components/ApiList/ApiList";
import { products } from "@/server/db/schemas";
import _ from "lodash";

const columns = ["name"];
const columnsExpanded = Object.keys(products).filter(
  (v) => !v.endsWith("ById"),
);

function WarehousePage() {
  return (
    <div className="bg-card p-3">
      <ApiList
        entryName="product"
        columns={columns}
        columnsExpanded={columnsExpanded}
      />
      {/* <img
        src="/assets/cardboard-box-with-lid-svgrepo-com.svg"
        className="h-64 w-64"
      /> */}
    </div>
  );
}

export default WarehousePage;
