import type { HTMLAttributes } from "react";
import { cx } from "../../internal/classNames";

export type GridraKbdSize = "sm" | "md";

export interface GridraKbdProps extends HTMLAttributes<HTMLElement> {
  size?: GridraKbdSize;
}

export function GridraKbd({
  className,
  size = "md",
  ...props
}: GridraKbdProps) {
  const rootClassName = cx(
    "gridra-kbd",
    `gridra-kbd--${size}`,
    className,
  );

  // kbdタグなんてあるんだね
  return <kbd className={rootClassName} {...props} />;
}
