import type { HTMLAttributes } from "react";

export type GridraKbdSize = "sm" | "md";

export interface GridraKbdProps extends HTMLAttributes<HTMLElement> {
  size?: GridraKbdSize;
}

export function GridraKbd({
  className,
  size = "md",
  ...props
}: GridraKbdProps) {
  const rootClassName = [
    "gridra-kbd",
    `gridra-kbd--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <kbd className={rootClassName} {...props} />;
}
