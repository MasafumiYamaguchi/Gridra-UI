import type { CSSProperties, HTMLAttributes } from "react";

export type GridraSkeletonVariant = "block" | "text" | "circle";
export type GridraSkeletonSize = "sm" | "md" | "lg";

export interface GridraSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  height?: number | string;
  rows?: number;
  size?: GridraSkeletonSize;
  variant?: GridraSkeletonVariant;
  width?: number | string;
}

function toStyleValue(raw: number | string | undefined): string | undefined {
  if (raw === undefined) return undefined;
  return typeof raw === "number" ? `${raw}px` : raw;
}

export function GridraSkeleton({
  animated = true,
  className,
  height,
  rows,
  size = "md",
  variant = "block",
  width,
  ...props
}: GridraSkeletonProps) {
  const rootClassName = [
    "gridra-skeleton",
    `gridra-skeleton--${variant}`,
    `gridra-skeleton--${size}`,
    animated && variant !== "circle" ? "gridra-skeleton--animated" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const style: CSSProperties = {
    ...(props.style as CSSProperties | undefined),
    "--gridra-skeleton-width": toStyleValue(width),
    "--gridra-skeleton-height": toStyleValue(height),
  } as CSSProperties;

  const common: Record<string, unknown> = {
    ...props,
    "aria-hidden": props["aria-hidden"] ?? true,
    className: rootClassName,
    style,
  };

  if (variant === "text" && rows !== undefined) {
    const count = Math.max(1, rows);
    const lines = Array.from({ length: count }, (_, i) => (
      <div key={i} className="gridra-skeleton__row" />
    ));

    return (
      <div {...common}>
        {lines}
      </div>
    );
  }

  return <div {...common} />;
}
