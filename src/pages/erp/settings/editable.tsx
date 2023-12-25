import Editable, { Key } from "@/components/editable/Editable";
import EditableAddress from "@/components/editable/EditableAddress";
import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableApiEntryId from "@/components/editable/EditableApiEntryId";
import EditableArray from "@/components/editable/EditableArray";
import EditableColor from "@/components/editable/EditableColor";
import EditableDate from "@/components/editable/EditableDate";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableEnum from "@/components/editable/EditableEnum";
import EditableFiles from "@/components/editable/EditableFiles";
import EditableJSON from "@/components/editable/EditableJSON";
import EditableMultiSelect from "@/components/editable/EditableMultiSelect";
import EditableNumber from "@/components/editable/EditableNumber";
import EditableObject from "@/components/editable/EditableObject";
import EditableRichText from "@/components/editable/EditableRichText";
import EditableShortText from "@/components/editable/EditableShortText";
import EditableSwitch from "@/components/editable/EditableSwitch";
import EditableText from "@/components/editable/EditableText";
import { Card, CardContent } from "@/components/ui/Card";
import ClientListItem from "@/page-components/erp/client/ClientListItem";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";

function TestEditablePage() {
  const [data, setData] = useState<Record<Key, any>>({
    EditableAddress: null,
    MultiSelect: ["XL"],
    EditableDebugInfo: "Debug something",
    EditableJSON: { "debug JSON": "test" },
  });

  useEffect(() => {
    return () => {
      localStorage.removeItem("test data");
    };
  });

  return (
    <Card className="m-2 px-2 pb-64 pt-2">
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
            <EditableApiEntryId
              keyName="EditableApiEntry"
              label="EditableApiEntry"
              entryName="client"
              Element={ClientListItem}
            />
            <EditableArray keyName="EditableArray" label="EditableArray">
              <EditableText />
            </EditableArray>

            <EditableColor keyName="EditableColor" label="EditableColor" />
            <EditableDate keyName="EditableDate" label="EditableDate" />
            <EditableDateTime
              keyName="EditableDateTime"
              label="EditableDateTime"
            />
            <EditableDebugInfo
              keyName="EditableDebugInfo"
              label="EditableDebugInfo"
            />
            <EditableEnum
              keyName="EditableEnum"
              label="EditableEnum"
              enum_data={["option 1", "option 2", "option 3", "option 4"]}
            />
            <EditableFiles keyName="EditableFiles" label="EditableFiles" />
            <EditableJSON keyName="EditableJSON" label="EditableJSON" />
            <EditableMultiSelect
              label="EditableMultiSelect"
              enum_data={["XL", "XS", "SM", "164"]}
              keyName="MultiSelect"
            />
            <EditableNumber
              keyName="EditableNumber"
              label="EditableNumber"
              increment={1}
            />
            <EditableObject keyName="EditableObject" label="EditableObject">
              <EditableColor keyName="EditableObjectColor" />
              <EditableText keyName="EditableObjectText" />
            </EditableObject>
            <EditableRichText
              keyName="EditableRichText"
              label="EditableRichText"
            />
            <EditableShortText
              keyName="EditableShortText"
              label="EditableShortText"
            />
            <EditableSwitch keyName="EditableSwitch" label="EditableSwitch" />
            <EditableText keyName="EditableText" label="EditableText" />
          </Editable>
        </div>
      </CardContent>
    </Card>
  );
}

export default TestEditablePage;
