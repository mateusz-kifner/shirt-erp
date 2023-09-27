/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type EditableInput from "@/schema/EditableInput";
import { Children, type ReactElement, cloneElement } from "react";

// TODO: make it work

interface EditableObjectProps extends EditableInput<any> {
  children: ReactElement[] | ReactElement;
}

function EditableObject(props: EditableObjectProps) {
  const { children, className, onSubmit, value } = props;

  return (
    <div className={className}>
      {Children.map(children, (child) => {
        const keyName = child.props.keyName;
        if (keyName === undefined) return child;
        return cloneElement(child, {
          value: value?.[child.props.keyName],
          onSubmit: (val: any) =>
            onSubmit?.({ ...value, [child.props.keyName]: val }),
        });
      })}
    </div>
  );
}

export default EditableObject;
