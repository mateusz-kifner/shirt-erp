import Editable, { Key } from "@/components/editable/Editable";
import EditableAddress from "@/components/editable/EditableAddress";
import EditableMultiSelect from "@/components/editable/EditableMultiSelect";
import { Card, CardContent } from "@/components/ui/Card";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";

function TestEditablePage() {
  const [data, setData] = useLocalStorage<Record<Key, any>>({
    key: "test data",
    defaultValue: {
      EditableAddress: undefined,
      MultiSelect: ["XL"],
    },
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
        <Editable
          data={data}
          onSubmit={(key, val) => setData((prev) => ({ ...prev, [key]: val }))}
        >
          <EditableAddress keyName="EditableAddress" label="EditableAddress" />

          <EditableMultiSelect
            label="EditableMultiSelect"
            enum_data={["XL", "XS", "SM", "164"]}
            keyName="MultiSelect"
          />
        </Editable>
      </CardContent>
    </Card>
  );
}

export default TestEditablePage;
