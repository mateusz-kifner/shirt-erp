import Editable, { type Key } from "@/components/editable/Editable";
import { lazy, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import CustomerListItem from "@/page-components/erp/customer/CustomerListItem";
import { IconAlertCircle } from "@tabler/icons-react";
import EditableArray from "@/components/editable/EditableArray";
import type { GetStaticProps } from "next";

const EditableAddress = lazy(
  () => import("@/components/editable/EditableAddress"),
);
const EditableApiEntry = lazy(
  () => import("@/components/editable/EditableApiEntry"),
);
const EditableApiEntryId = lazy(
  () => import("@/components/editable/EditableApiEntryId"),
);
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
    EditableArray: [],
    EditableArray2: [],
  });

  return (
    <Card className="m-2 px-2 pt-2 pb-64">
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
              entryName="customer"
              Element={CustomerListItem}
            />
            <EditableApiEntryId
              keyName="EditableApiEntry"
              label="EditableApiEntry"
              entryName="customer"
              Element={CustomerListItem}
            />
            <EditableArray keyName="EditableArray" label="EditableArray">
              <EditableText />
            </EditableArray>

            <EditableArray<string>
              keyName="EditableArray2"
              label="EditableArray2"
            >
              {(key, overrideProps) => (
                <div className="border border-red-500 border-solid" key={key}>
                  <EditableText {...overrideProps} />
                </div>
              )}
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
              enumData={["XL", "XS", "SM", "164"]}
              keyName="MultiSelect"
            />
            <EditableMultiSelect
              label="EditableMultiSelect2"
              enumData={["Red", "Green", "Blue", "Yellow"]}
              keyName="MultiSelect2"
              freeInput
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
            <EditableSwitch
              keyName="EditableSwitch"
              label="EditableSwitch"
              variant="color"
            />
            <EditableText keyName="EditableText" label="EditableText" />
          </Editable>
        </div>
      </CardContent>
    </Card>
  );
}

export default TestEditablePage;

export const getStaticProps: GetStaticProps = () => {
  if (process.env.NODE_ENV === "production") {
    return { notFound: true };
  }
  return { props: {} };
};
