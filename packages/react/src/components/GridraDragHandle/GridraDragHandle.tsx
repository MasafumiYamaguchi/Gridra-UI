import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";

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
  // DragHandleは操作開始点の見た目だけを担当し、ドラッグ状態や座標計算は親コンポーネントに委ねる。
  const handleClassName = cx(
    "gridra-drag-handle",
    `gridra-drag-handle--${position}`,
    className,
  );

  return (
    <span
      aria-hidden={children ? undefined : true}
      className={handleClassName}
      {...props}
    >
      {children ?? <span className="gridra-drag-handle__grip" />}
    </span>
  );
}
