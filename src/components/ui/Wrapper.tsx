import { type ReactElement, type ReactNode, cloneElement } from "react";

interface WrapperProps {
  children: ReactElement;
  wrapperClassName?: string;
  wrapperLeftSection?: ReactNode;
  wrapperRightSection?: ReactNode;

  [key: string]: any;
}

function Wrapper(props: WrapperProps) {
  const {
    children,
    wrapperClassName,
    wrapperLeftSection,
    wrapperRightSection,
    ...innerProps
  } = props;

  return (
    <div className={wrapperClassName}>
      {!!wrapperLeftSection && wrapperLeftSection}
      {cloneElement(children, innerProps)}
      {!!wrapperRightSection && wrapperRightSection}
    </div>
  );
}

export default Wrapper;
