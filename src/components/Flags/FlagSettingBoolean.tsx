import useTranslation from "@/hooks/useTranslation";
import { useId } from "react";
import _ from "lodash";
import { Switch } from "../ui/Switch";

interface FlagSettingBooleanProps {
  onChange?: (value: boolean) => void;
  onToggle?: () => void;
  initialValue: boolean;
  name: string;
}

const FlagSettingBoolean = (props: FlagSettingBooleanProps) => {
  const { initialValue, onChange, onToggle, name } = props;
  const t = useTranslation();
  const uuid = useId();
  return (
    <div className="flex grow items-center justify-between gap-2">
      <span className="w-1/2">
        {typeof t[name as keyof typeof t] === "string"
          ? (t[name as keyof typeof t] as string)
          : name}
      </span>
      <span className="w-1/2">
        <Switch
          variant={"color"}
          defaultChecked={initialValue}
          onCheckedChange={onChange}
        />
      </span>
    </div>
  );
};

export default FlagSettingBoolean;
