import React, { type ButtonHTMLAttributes, forwardRef } from "react";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (props, ref) => {
    const { children, className, ...moreProps } = props;
    return (
      <button
        className={`action-button ${className ?? ""}`}
        ref={ref}
        {...moreProps}
      >
        {children}
      </button>
    );
  }
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
