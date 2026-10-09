import type { HTMLAttributes } from "react";
import { cx } from "../../internal/classNames";

export type GridraBadgeShape = "square" | "rounded" | "pill";
export type GridraBadgeSize = "sm" | "md";
export type GridraBadgeVariant = "solid" | "outline";
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
  variant?: GridraBadgeVariant;
}

export function GridraBadge({
  className,
  shape = "square",
  size = "md",
  tone = "default",
  variant = "solid",
  ...props
}: GridraBadgeProps) {
  // Badgeは状態を持たない表示プリミティブなので、tone/size/shapeをclassへ写すだけに留める。
  const badgeClassName = cx(
    "gridra-badge",
    `gridra-badge--${tone}`,
    `gridra-badge--${size}`,
    `gridra-badge--${shape}`,
    `gridra-badge--${variant}`,
    className,
  );

  return <span className={badgeClassName} {...props} />;
}
