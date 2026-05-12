import type { HTMLAttributes } from "react";

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
  const dividerClassName = [
    "gridra-divider",
    `gridra-divider--${orientation}`,
    `gridra-divider--${spacing}`,
    `gridra-divider--${tone}`,
    inset ? "gridra-divider--inset" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <hr
      aria-orientation={orientation}
      className={dividerClassName}
      role="separator"
      {...props}
    />
  );
}
