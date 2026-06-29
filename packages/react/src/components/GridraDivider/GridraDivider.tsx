import type { HTMLAttributes } from "react";
import { cx } from "../../internal/classNames";

export type GridraDividerOrientation = "horizontal" | "vertical";
export type GridraDividerSpacing = "none" | "sm" | "md" | "lg";
export type GridraDividerTone = "default" | "strong" | "muted";

export interface GridraDividerProps extends HTMLAttributes<HTMLHRElement> {
  inset?: boolean;
  orientation?: GridraDividerOrientation;
  spacing?: GridraDividerSpacing;
  tone?: GridraDividerTone;
}

export function GridraDivider({
  className,
  inset = false,
  orientation = "horizontal",
  spacing = "sm",
  tone = "default",
  ...props
}: GridraDividerProps) {
  // 視覚的な線でも支援技術にはseparatorとして伝わるよう、orientationをARIAにも反映する。
  const dividerClassName = cx(
    "gridra-divider",
    `gridra-divider--${orientation}`,
    `gridra-divider--${spacing}`,
    `gridra-divider--${tone}`,
    inset ? "gridra-divider--inset" : null,
    className,
  );

  return (
    <hr
      aria-orientation={orientation}
      className={dividerClassName}
      role="separator"
      {...props}
    />
  );
}
