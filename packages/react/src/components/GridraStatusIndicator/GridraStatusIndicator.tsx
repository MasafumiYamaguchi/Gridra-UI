import type { HTMLAttributes, ReactNode } from "react";

export type GridraStatusIndicatorTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent";
export type GridraStatusIndicatorSize = "sm" | "md";

export interface GridraStatusIndicatorProps
  extends HTMLAttributes<HTMLSpanElement> {
  label?: ReactNode;
  pulse?: boolean;
  size?: GridraStatusIndicatorSize;
  tone?: GridraStatusIndicatorTone;
}

export function GridraStatusIndicator({
  className,
  label,
  pulse = false,
  size = "md",
  tone = "neutral",
  ...props
}: GridraStatusIndicatorProps) {
  const rootClassName = [
    "gridra-status-indicator",
    `gridra-status-indicator--${tone}`,
    `gridra-status-indicator--${size}`,
    pulse ? "gridra-status-indicator--pulse" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={rootClassName} {...props}>
      <span aria-hidden="true" className="gridra-status-indicator__dot" />
      {label ? (
        <span className="gridra-status-indicator__label">{label}</span>
      ) : null}
    </span>
  );
}
