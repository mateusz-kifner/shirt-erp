import Editable, { Key } from "@/components/editable/Editable";
import { lazy, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import ClientListItem from "@/page-components/erp/client/ClientListItem";
import { IconAlertCircle } from "@tabler/icons-react";

const EditableAddress = lazy(
  () => import("@/components/editable/EditableAddress"),
);
const EditableApiEntry = lazy(
  () => import("@/components/editable/EditableApiEntry"),
);
const EditableApiEntryId = lazy(
  () => import("@/components/editable/EditableApiEntryId"),
);
const EditableArray = lazy(() => import("@/components/editable/EditableArray"));
const EditableColor = lazy(() => import("@/components/editable/EditableColor"));
const EditableDate = lazy(() => import("@/components/editable/EditableDate"));
const EditableDateTime = lazy(
  () => import("@/components/editable/EditableDateTime"),
);
const EditableDebugInfo = lazy(
  () => import("@/components/editable/EditableDebugInfo"),
);
const EditableEnum = lazy(() => import("@/components/editable/EditableEnum"));
const EditableFiles = lazy(() => import("@/components/editable/EditableFiles"));
const EditableJSON = lazy(() => import("@/components/editable/EditableJSON"));
const EditableMultiSelect = lazy(
  () => import("@/components/editable/EditableMultiSelect"),
);
const EditableNumber = lazy(
  () => import("@/components/editable/EditableNumber"),
);
const EditableObject = lazy(
  () => import("@/components/editable/EditableObject"),
);
const EditableRichText = lazy(
  () => import("@/components/editable/EditableRichText"),
);
const EditableShortText = lazy(
  () => import("@/components/editable/EditableShortText"),
);
const EditableSwitch = lazy(
  () => import("@/components/editable/EditableSwitch"),
);
const EditableText = lazy(() => import("@/components/editable/EditableText"));

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
