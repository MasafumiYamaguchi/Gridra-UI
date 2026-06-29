import type { HTMLAttributes } from "react";
import { cx } from "../../internal/classNames";

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
  // Badgeは状態を持たない表示プリミティブなので、tone/size/shapeをclassへ写すだけに留める。
  const badgeClassName = cx(
    "gridra-badge",
    `gridra-badge--${tone}`,
    `gridra-badge--${size}`,
    `gridra-badge--${shape}`,
    className,
  );

  return <span className={badgeClassName} {...props} />;
}
