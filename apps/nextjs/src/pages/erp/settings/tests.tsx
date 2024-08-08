import EditableShortText from "@/components/editable/EditableShortText";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useId, useState } from "react";
import { type Key, Editable } from "@/components/editable/Editable";
import EditableColor from "@/components/editable/EditableColor";
import EditableArray from "@/components/editable/EditableArray";
import type { GetStaticProps } from "next";

function TestsPage() {
  const uuid = useId();
  const [data, setData] = useState<Record<Key, any>>({
    EditableArrayUndef: undefined,
    EditableArrayColor: [],
    EditableArrayTest: [],
  });
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4 p-2 pb-96">
      <Card key={`${uuid}`}>
        <CardHeader>
          <CardTitle>Arrays</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-28 whitespace-pre-wrap font-mono">
            {JSON.stringify(data, null, 2)}
          </div>
          <Editable
            data={data}
            onSubmit={(key, val) =>
              setData((prev) => ({ ...prev, [key]: val }))
            }
          >
            <EditableArray
              keyName="EditableArrayUndef"
              label="EditableArrayUndef"
            >
              <EditableShortText />
            </EditableArray>
            <EditableArray
              keyName="EditableArrayTest"
              label="EditableArrayTest"
            >
              <EditableShortText />
            </EditableArray>
            <EditableArray
              keyName="EditableArrayColor"
              label="EditableArrayColor"
            >
              <EditableColor />
            </EditableArray>
          </Editable>
        </CardContent>
      </Card>
    </div>
  );
}

export default TestsPage;

export const getStaticProps: GetStaticProps = () => {
  if (process.env.NODE_ENV === "production") {
    return { notFound: true };
  }
  return { props: {} };
};
