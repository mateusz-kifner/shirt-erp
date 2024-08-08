import _ from "lodash";
import { useRouter } from "next/router";

import ApiList from "@/components/ApiList";
import type { RouterNames } from "@/utils/trpc";
import navigationData from "@/components/layout/Navigation/navigationData";
import { customers } from "@/server/db/schemas";
import Button from "@shirterp/ui-web/Button";
import { IconPlus } from "@tabler/icons-react";
import CustomerAvatar from "./CustomerAvatar";
import { truncString } from "@/utils/truncString";
import {
  BooleanValueTransformer,
  AddressIdValueTransformer,
} from "@/components/ApiList/valueTransformers";

const entryName: RouterNames = "customer";

const gradient =
  navigationData?.[entryName as keyof typeof navigationData]?.gradient;

const color =
  navigationData?.[entryName as keyof typeof navigationData]?.gradient?.to;

const gradientCSS = `linear-gradient(${gradient?.deg ?? 0}deg, ${
  gradient ? `${gradient.to}33` : color
},${gradient ? `${gradient.from}33` : color} )`;

const columns = ["fullname"];
const columnsExpanded = Object.keys(customers).filter(
  (v) => !v.endsWith("ById"),
);

const fullNameGenerator = <T extends Record<string, any>>(
  columns: string[],
  data: T | undefined = [] as unknown as T,
) => [
  {
    columnName: "fullname",
    columnData: data.map((value: any) => {
      const primary = value ? (
        (value?.firstname && value.firstname?.length > 0) ||
        (value?.lastname && value.lastname?.length > 0) ? (
          truncString(`${value.firstname ?? ""} ${value.lastname ?? ""}`, 40)
        ) : (
          <i>{truncString(value?.username ?? "", 40)}</i>
        )
      ) : undefined;

      return primary;
    }),
    insertIndex: 0,
  },
];

interface CustomerListProps {
  selectedId: number | null;
  onAddElement?: () => void;
}

const CustomersList = ({ selectedId, onAddElement }: CustomerListProps) => {
  const router = useRouter();

  return (
    <ApiList
      columns={columns}
      columnsExpanded={columnsExpanded}
      filterKeys={["username", "firstname", "email", "companyName"]}
      entryName={entryName}
      selectedId={selectedId}
      selectedColor={gradient ? gradientCSS : undefined}
      onChange={(id: number) => void router.push(`/erp/${entryName}/${id}`)}
      rightSection={
        <Button
          size="icon"
          variant="outline"
          className="h-9 w-9 rounded-full p-1"
          onClick={onAddElement}
        >
          <IconPlus />
        </Button>
      }
      BeforeCell={CustomerAvatar}
      generated={fullNameGenerator}
      customSortActions={{
        fullname: (desc: boolean) => [
          { id: "firstname", desc },
          { id: "lastname", desc },
        ],
      }}
      valueTransformers={{
        isTemplate: BooleanValueTransformer,
        addressId: AddressIdValueTransformer,
      }}
    />
  );
};

export default CustomersList;
