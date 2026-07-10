import type { HTMLAttributes, ReactNode } from "react";

export type GridraResizeHandlePosition =
  | "right"
  | "bottom"
  | "bottom-right"
  | "inline";

export interface GridraResizeHandleProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  // positionは見た目とカーソル方向を決め、実際のリサイズ処理は親に委ねる。
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

  // 装飾だけの場合は支援技術から隠し、childrenがあれば内容を読めるようにする。
  return (
    <span aria-hidden={children ? undefined : true} className={handleClassName} {...props}>
      {children ?? <span className="gridra-resize-handle__corner" />}
    </span>
  );
}
