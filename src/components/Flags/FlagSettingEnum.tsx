import useTranslation from "@/hooks/useTranslation";
import { useId, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import _ from "lodash";

interface FlagSettingEnumProps {
  onChange?: (value: string) => void;
  onToggle?: () => void;
  initialValue: string;
  options: string[];
  name: string;
}

const FlagSettingEnum = (props: FlagSettingEnumProps) => {
  const { initialValue, onChange, onToggle, options = [], name } = props;
  const t = useTranslation();
  const uuid = useId();
  return (
    <div className="flex grow items-center justify-between gap-2">
      <span className="w-1/2">
        {typeof t[name as keyof typeof t] === "string"
          ? (t[name as keyof typeof t] as string)
          : name}
      </span>
      <Select defaultValue={initialValue} onValueChange={onChange}>
        <SelectTrigger className="w-1/2">
          <SelectValue placeholder={`${t.select} ...`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((val, index) => (
            <SelectItem value={val} key={`${uuid}${index}`}>
              {_.capitalize(
                typeof t[val as keyof typeof t] === "string"
                  ? (t[val as keyof typeof t] as string)
                  : val,
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FlagSettingEnum;
