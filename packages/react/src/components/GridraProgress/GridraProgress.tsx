import { getGridraProgress } from "@gridra-ui/headless";
import type { HTMLAttributes } from "react";

export type GridraProgressSize = "sm" | "md" | "lg";

export type GridraProgressTone =
  "default" | "muted" | "accent" | "success" | "warning" | "danger";

export interface GridraProgressProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  max?: number;
  size?: GridraProgressSize;
  tone?: GridraProgressTone;
  value?: number;
}

export function GridraProgress({
  className,
  label,
  max = 100,
  size = "md",
  tone = "default",
  value,
  ...props
}: GridraProgressProps) {
  const { isIndeterminate, percent, rootProps } = getGridraProgress({
    value,
    max,
    label,
  });

  const rootClassName = [
    "gridra-progress",
    `gridra-progress--${size}`,
    `gridra-progress--${tone}`,
    isIndeterminate ? "gridra-progress--indeterminate" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName} {...rootProps} {...props}>
      <div
        className="gridra-progress__fill"
        style={isIndeterminate ? undefined : { width: `${percent}%` }}
      />
    </div>
  );
}
