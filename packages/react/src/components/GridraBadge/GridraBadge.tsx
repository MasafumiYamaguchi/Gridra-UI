import type { HTMLAttributes } from "react";

export type GridraBadgeTone = "default" | "accent" | "muted";

export interface GridraBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: GridraBadgeTone;
}

export function GridraBadge({
  className,
  tone = "default",
  ...props
}: GridraBadgeProps) {
  const badgeClassName = ["gridra-badge", `gridra-badge--${tone}`, className]
    .filter(Boolean)
    .join(" ");

  return <span className={badgeClassName} {...props} />;
}
