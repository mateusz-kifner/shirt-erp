import Editable, { Key } from "@/components/editable/Editable";
import EditableMultiSelect from "@/components/editable/EditableMultiSelect";
import { Card, CardContent } from "@/components/ui/Card";
import { useState } from "react";

function TestEditablePage() {
  const [data, setData] = useState<Record<Key, any>>({
    MultiSelect: ["XL"],
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
