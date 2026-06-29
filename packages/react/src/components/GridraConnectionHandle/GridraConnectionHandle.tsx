import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";

export type GridraConnectionHandlePosition =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "inline";

export type GridraConnectionHandleKind = "input" | "output";

export interface GridraConnectionHandleProps extends HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  children?: ReactNode;
  kind?: GridraConnectionHandleKind;
  position?: GridraConnectionHandlePosition;
}

export function GridraConnectionHandle({
  active = false,
  children,
  className,
  kind = "output",
  position = "right",
  ...props
}: GridraConnectionHandleProps) {
  // 接続処理の状態はCanvas側が持ち、Handleはkind/position/activeをDOM属性とclassで表すだけにする。
  const handleClassName = cx(
    "gridra-connection-handle",
    `gridra-connection-handle--${kind}`,
    `gridra-connection-handle--${position}`,
    active ? "gridra-connection-handle--active" : null,
    className,
  );

  return (
    <span
      aria-hidden={children ? undefined : true}
      className={handleClassName}
      data-gridra-connection-kind={kind}
      {...props}
    >
      {children ?? <span className="gridra-connection-handle__dot" />}
    </span>
  );
}
