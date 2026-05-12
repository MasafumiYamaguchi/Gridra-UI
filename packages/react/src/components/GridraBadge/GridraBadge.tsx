import type { HTMLAttributes } from "react";

export type GridraBadgeShape = "square" | "rounded" | "pill";
export type GridraBadgeSize = "sm" | "md";
export type GridraBadgeTone =
  | "default"
  | "accent"
  | "muted"
  | "success"
  | "warning"
  | "danger";

export interface GridraBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  shape?: GridraBadgeShape;
  size?: GridraBadgeSize;
  tone?: GridraBadgeTone;
}

export function GridraBadge({
  className,
  shape = "square",
  size = "md",
  tone = "default",
  ...props
}: GridraBadgeProps) {
  const badgeClassName = [
    "gridra-badge",
    `gridra-badge--${tone}`,
    `gridra-badge--${size}`,
    `gridra-badge--${shape}`,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={badgeClassName} {...props} />;
}
