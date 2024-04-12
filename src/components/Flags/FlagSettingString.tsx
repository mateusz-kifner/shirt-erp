interface FlagSettingStringProps {
  onChange?: (value: string) => void;
  initialValue: string;
  name: string;
}

const FlagSettingString = (props: FlagSettingStringProps) => {
  const { initialValue, onChange, name } = props;
  return (
    <div>
      {"[ NOT IMPLEMENTED ]"}
      {name} {initialValue}
    </div>
  );
};

export default FlagSettingString;
