import EditableInput from "@/schema/EditableInput";
import { Children, ReactElement, cloneElement, useId } from "react";
import NotImplemented from "../NotImplemented";

interface Editable2Props {
  data: { [key: string]: any };
  onSubmit?: (key: string, value: any) => void;
  children: ReactElement<EditableInput<any>>;
}

function Editable2(props: Editable2Props) {
  const { data, onSubmit, children } = props;
  const uuid = useId();

  return (
    <div>
      {Children.map(children, (child, index) => {
        const keyName = child.props.keyName;
        if (keyName === undefined || !Object.keys(data).includes(keyName))
          return (
            <NotImplemented
              message={"Component doesn't have a key, and cannot be rendered"}
              object_key={keyName}
              value={child}
              key={`:Editable${uuid}${index}:`}
            />
          );
        return cloneElement(child, {
          value: data[keyName as keyof typeof data],
          onSubmit: ((value) =>
            onSubmit?.(keyName, value)) as typeof child.props.onSubmit,
        });
      })}
    </div>
  );
}

export default Editable2;
