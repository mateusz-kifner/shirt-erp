import _ from "lodash";
import { useRouter } from "next/router";

import ApiList from "@/components/ApiList";
import type { RouterNames } from "@/utils/trpc";
import navigationData from "@/components/layout/Navigation/navigationData";
import { global_properties } from "@/server/db/schemas";
import Button from "@/components/ui/Button";
import { IconPlus } from "@tabler/icons-react";

const entryName: RouterNames = "globalProperty";

const gradient =
  navigationData?.[entryName as keyof typeof navigationData]?.gradient;

const color =
  navigationData?.[entryName as keyof typeof navigationData]?.gradient?.to;

const gradientCSS = `linear-gradient(${gradient?.deg ?? 0}deg, ${
  gradient ? `${gradient.to}33` : color
},${gradient ? `${gradient.from}33` : color} )`;

const columns = ["firstname", "lastname"];
const columnsExpanded = Object.keys(global_properties).filter(
  (v) => !v.endsWith("ById"),
);

interface GlobalPropertiesListProps {
  selectedId: number | null;
  onAddElement?: () => void;
}

const GlobalPropertiesList = ({
  selectedId,
  onAddElement,
}: GlobalPropertiesListProps) => {
  const router = useRouter();

  return (
    <ApiList
      columns={columns}
      columnsExpanded={columnsExpanded}
      filterKeys={["name"]}
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
    />
  );
};

export default GlobalPropertiesList;
