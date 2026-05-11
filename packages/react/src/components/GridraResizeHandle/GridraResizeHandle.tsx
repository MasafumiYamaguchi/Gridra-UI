import type { HTMLAttributes, ReactNode } from "react";

export type GridraResizeHandlePosition =
  | "right"
  | "bottom"
  | "bottom-right"
  | "inline";

export interface GridraResizeHandleProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  position?: GridraResizeHandlePosition;
}

export function GridraResizeHandle({
  children,
  className,
  position = "bottom-right",
  ...props
}: GridraResizeHandleProps) {
  const handleClassName = [
    "gridra-resize-handle",
    `gridra-resize-handle--${position}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span aria-hidden={children ? undefined : true} className={handleClassName} {...props}>
      {children ?? <span className="gridra-resize-handle__corner" />}
    </span>
  );
}
