import type { HTMLAttributes } from "react";

export type GridraDividerOrientation = "horizontal" | "vertical";

export interface GridraDividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: GridraDividerOrientation;
}

export function GridraDivider({
  className,
  orientation = "horizontal",
  ...props
}: GridraDividerProps) {
  const dividerClassName = [
    "gridra-divider",
    `gridra-divider--${orientation}`,
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
