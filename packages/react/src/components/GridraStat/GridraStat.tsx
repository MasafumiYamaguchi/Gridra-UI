import type { HTMLAttributes, ReactNode } from "react";

export type GridraStatAlign = "start" | "center" | "end";
export type GridraStatSize = "sm" | "md" | "lg";
export type GridraStatTone = "default" | "accent" | "muted";

export interface GridraStatProps extends HTMLAttributes<HTMLDivElement> {
  align?: GridraStatAlign;
  description?: ReactNode;
  label?: ReactNode;
  size?: GridraStatSize;
  tone?: GridraStatTone;
  value: ReactNode;
}

export function GridraStat({
  align = "start",
  className,
  description,
  label,
  size = "md",
  tone = "default",
  value,
  ...props
}: GridraStatProps) {
  const rootClassName = [
    "gridra-stat",
    `gridra-stat--${size}`,
    `gridra-stat--${tone}`,
    `gridra-stat--align-${align}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName} {...props}>
      {label ? <div className="gridra-stat__label">{label}</div> : null}
      <div className="gridra-stat__value">{value}</div>
      {description ? (
        <div className="gridra-stat__description">{description}</div>
      ) : null}
    </div>
  );
}
