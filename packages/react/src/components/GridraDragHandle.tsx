import type { HTMLAttributes, ReactNode } from "react";

export type GridraDragHandlePosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "inline";

export interface GridraDragHandleProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  position?: GridraDragHandlePosition;
}

export function GridraDragHandle({
  children,
  className,
  position = "top-left",
  ...props
}: GridraDragHandleProps) {
  const handleClassName = [
    "gridra-drag-handle",
    `gridra-drag-handle--${position}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span aria-hidden={children ? undefined : true} className={handleClassName} {...props}>
      {children ?? <span className="gridra-drag-handle__grip" />}
    </span>
  );
}
