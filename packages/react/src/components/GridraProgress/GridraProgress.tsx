import type { HTMLAttributes } from "react";

export type GridraProgressSize = "sm" | "md" | "lg";
export type GridraProgressTone =
  | "default"
  | "muted"
  | "accent"
  | "success"
  | "warning"
  | "danger";

export interface GridraProgressProps
  extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  max?: number;
  size?: GridraProgressSize;
  tone?: GridraProgressTone;
  value?: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
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
  const isIndeterminate = value === undefined;
  const clampedValue = isIndeterminate ? 0 : clamp(value, 0, max);
  const fraction = isIndeterminate ? 0 : clampedValue / max;
  const percent = fraction * 100;

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
    <div
      className={rootClassName}
      role="progressbar"
      aria-label={label || undefined}
      aria-valuemax={isIndeterminate ? undefined : max}
      aria-valuemin={isIndeterminate ? undefined : 0}
      aria-valuenow={isIndeterminate ? undefined : clampedValue}
      {...props}
    >
      <div
        className="gridra-progress__fill"
        style={
          isIndeterminate ? undefined : { width: `${percent}%` }
        }
      />
    </div>
  );
}
