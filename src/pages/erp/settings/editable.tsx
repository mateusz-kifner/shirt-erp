import Editable, { Key } from "@/components/editable/Editable";
import EditableAddress from "@/components/editable/EditableAddress";
import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableMultiSelect from "@/components/editable/EditableMultiSelect";
import { Card, CardContent } from "@/components/ui/Card";
import ClientListItem from "@/page-components/erp/client/ClientListItem";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";

function TestEditablePage() {
  const [data, setData] = useState<Record<Key, any>>({
    EditableAddress: null,
    MultiSelect: ["XL"],
  });

  useEffect(() => {
    return () => {
      localStorage.removeItem("test data");
    };
  });

  return (
    <Card className="m-2 p-2">
      <CardContent>
        <div className="min-h-28 whitespace-pre-wrap font-mono">
          {JSON.stringify(data, null, 2)}
        </div>
        <div className="flex flex-col gap-4">
          <Editable
            data={data}
            onSubmit={(key, val) =>
              setData((prev) => ({ ...prev, [key]: val }))
            }
          >
            <EditableAddress
              keyName="EditableAddress"
              label="EditableAddress"
              leftSection={<IconAlertCircle />}
            />
            <EditableApiEntry
              keyName="EditableApiEntry"
              label="EditableApiEntry"
              entryName="client"
              Element={ClientListItem}
            />
            <EditableMultiSelect
              label="EditableMultiSelect"
              enum_data={["XL", "XS", "SM", "164"]}
              keyName="MultiSelect"
            />
          </Editable>
        </div>
      </CardContent>
    </Card>
  );
}

export default TestEditablePage;
