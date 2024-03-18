import { type OrderWithoutRelations } from "@/server/api/order/validator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Editable from "@/components/editable/Editable";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableSwitch from "@/components/editable/EditableSwitch";
import EditableEnum from "@/components/editable/EditableEnum";
import EditableFiles from "@/components/editable/EditableFiles";
import EditableArray from "@/components/editable/EditableArray";
import EditableApiEntry from "@/components/editable/EditableApiEntry";
import { type Product } from "@/server/api/product/validator";
import EditableNumber from "@/components/editable/EditableNumber";
import { truncString } from "@/utils/truncString";
import ProductListItem from "../product/ProductListItem";
import EditableRichText from "@/components/editable/EditableRichText";
import RefetchButton from "@/components/ui/RefetchButton";
interface OrderProductionViewProps {
  orderApiUpdate: (key: string | number, value: any) => void;
  orderData?: OrderWithoutRelations;
  refetch?: () => void;
}

function OrderProductionView(props: OrderProductionViewProps) {
  const { orderData, orderApiUpdate, refetch } = props;
  if (orderData === undefined) return <div>Loading ...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <RefetchButton onClick={() => refetch?.()} />
          Produkcja
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-4">
        <Editable data={orderData} onSubmit={orderApiUpdate}>
          <EditableDebugInfo label="ID: " keyName="id" />
          <EditableEnum
            label="Status"
            keyName="status"
            enum_data={[
              "planned",
              "accepted",
              "in_production",
              "wrapped",
              "sent",
              "rejected",
            ]}
          />
          <EditableRichText label="Notatki" keyName="notes" />
          <EditableEnum
            label="Typ druku"
            keyName="workstationType"
            enum_data={["not_set", "screen_printing", "foil", "dtf", "other"]}
          />
          <EditableSwitch
            keyName="isProductOrdered"
            label="Koszulki zamówione: "
            variant="color"
          />
          <EditableSwitch
            keyName="isInWarehouse"
            label="W magazynie: "
            variant="color"
          />
          <EditableFiles keyName="files" label="Pliki" />
          <EditableArray<Product> label="Produkty" keyName="products">
            <EditableApiEntry
              linkEntry
              entryName="product"
              Element={ProductListItem}
              copyProvider={(value: Product | null) =>
                value?.name ? truncString(value.name, 40) : undefined
              }
              allowClear
            />
          </EditableArray>
          <EditableNumber
            label="Całkowity czas pracy"
            min={0}
            increment={1}
            fixed={0}
            keyName="workTime"
          />
        </Editable>
      </CardContent>
    </Card>
  );
}

export default OrderProductionView;
