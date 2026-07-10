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
  // 数値はpxとして扱い、文字列なら%などのCSS長をそのまま許可する。
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
    // circleは専用の見た目を保つため、共通のアニメーションmodifierを付けない。
    animated && variant !== "circle" ? "gridra-skeleton--animated" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // widthとheightはCSS変数に渡し、variantごとのCSSから共通利用する。
  const style: CSSProperties = {
    ...(props.style as CSSProperties | undefined),
    "--gridra-skeleton-width": toStyleValue(width),
    "--gridra-skeleton-height": toStyleValue(height),
  } as CSSProperties;

  // 読み込み中の装飾なので、指定がなければ支援技術から隠す。
  const common: Record<string, unknown> = {
    ...props,
    "aria-hidden": props["aria-hidden"] ?? true,
    className: rootClassName,
    style,
  };

  if (variant === "text") {
    // textは最低1行を保証し、行ごとの要素を生成する。
    const count = Math.max(1, rows ?? 1);
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
