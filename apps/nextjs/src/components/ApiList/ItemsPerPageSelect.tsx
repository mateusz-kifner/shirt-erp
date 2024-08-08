import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shirterp/ui-web/Select";

interface ItemsPerPageSelectProps {
  defaultValue: number;
  onChange: (value: number) => void;
}

function ItemsPerPageSelect(props: ItemsPerPageSelectProps) {
  const { defaultValue, onChange } = props;

  return (
    <Select
      defaultValue={`${defaultValue}`}
      onValueChange={(value) => onChange(Number.parseInt(value))}
    >
      <SelectTrigger className="w-16">
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="6">6</SelectItem>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="20">20</SelectItem>
        <SelectItem value="40">40</SelectItem>
        <SelectItem value="80">80</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default ItemsPerPageSelect;
