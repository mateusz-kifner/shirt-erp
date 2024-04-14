import { useRouter } from "next/router";
import ApiList from "@/components/ApiList";
import {
  ExpenseListProps,
  columns,
  columnsExpanded,
  entryName,
  gradient,
  gradientCSS,
} from "./ExpenseList";

export const ExpensesList = ({
  selectedId,
  onAddElement,
}: ExpenseListProps) => {
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
