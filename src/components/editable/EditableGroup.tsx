import EditableInput from "@/schema/EditableInput";
import { Children, ReactElement, cloneElement } from "react";

// TODO: make it work

interface EditableGroupProps extends EditableInput<any> {
  children: ReactElement[] | ReactElement;
}

function EditableGroup(props: EditableGroupProps) {
  const { children, className, onSubmit, value } = props;

  return (
    <div className={className}>
      {Children.map(children, (child, index) => {
        console.log(child);
        return cloneElement(child, {});
      })}
    </div>
  );
}

export default EditableGroup;
