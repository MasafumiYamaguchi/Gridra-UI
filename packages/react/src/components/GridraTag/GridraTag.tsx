import type { HTMLAttributes } from "react";

export type GridraTagSize = "sm" | "md";
export type GridraTagTone = "default" | "accent" | "muted" | "success" | "warning" | "danger";

export interface GridraTagProps extends HTMLAttributes<HTMLSpanElement> {
  size?: GridraTagSize;
  tone?: GridraTagTone;
}

export function GridraTag({
  className,
  size = "md",
  tone = "default",
  ...props
}: GridraTagProps) {
  const rootClassName = [
    "gridra-tag",
    `gridra-tag--${size}`,
    `gridra-tag--${tone}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={rootClassName} {...props} />;
}
