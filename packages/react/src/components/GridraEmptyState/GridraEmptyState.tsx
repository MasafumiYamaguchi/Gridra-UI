import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";

export type GridraEmptyStateSize = "sm" | "md" | "lg";

export interface GridraEmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  description?: ReactNode;
  heading?: ReactNode;
  icon?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  size?: GridraEmptyStateSize;
}

export function GridraEmptyState({
  children,
  className,
  description,
  heading,
  icon,
  primaryAction,
  secondaryAction,
  size = "md",
  ...props
}: GridraEmptyStateProps) {
  const rootClassName = cx(
    "gridra-empty-state",
    `gridra-empty-state--${size}`,
    className,
  );

  return (
    <div className={rootClassName} {...props}>
      {icon ? (
        <div aria-hidden="true" className="gridra-empty-state__icon">
          {icon}
        </div>
      ) : null}
      <div className="gridra-empty-state__content">
        {heading ? (
          <div className="gridra-empty-state__heading">{heading}</div>
        ) : null}
        {description ? (
          <div className="gridra-empty-state__description">{description}</div>
        ) : null}
        {children ? (
          <div className="gridra-empty-state__body">{children}</div>
        ) : null}
      </div>
      {primaryAction || secondaryAction ? (
        <div className="gridra-empty-state__actions">
          {primaryAction}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}
