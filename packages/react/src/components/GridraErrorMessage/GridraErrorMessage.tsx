import type { HTMLAttributes, ReactNode } from "react";

export type GridraErrorMessageTone = "danger" | "warning" | "muted";

export interface GridraErrorMessageProps
  extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  tone?: GridraErrorMessageTone;
}

export function GridraErrorMessage({
  children,
  className,
  icon,
  tone = "danger",
  ...props
}: GridraErrorMessageProps) {
  const rootClassName = [
    "gridra-error-message",
    `gridra-error-message--${tone}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName} {...props}>
      {icon ? (
        <span aria-hidden="true" className="gridra-error-message__icon">
          {icon}
        </span>
      ) : null}
      <span className="gridra-error-message__text">{children}</span>
    </div>
  );
}
