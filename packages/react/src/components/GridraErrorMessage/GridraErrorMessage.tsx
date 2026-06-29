import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";

export type GridraErrorMessageTone = "danger" | "warning" | "muted";

export interface GridraErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
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
  // Fieldなどから組み込まれる想定なので、role付与は親の文脈に任せて表示だけを担当する。
  const rootClassName = cx(
    "gridra-error-message",
    `gridra-error-message--${tone}`,
    className,
  );

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
