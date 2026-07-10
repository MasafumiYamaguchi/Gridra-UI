import type { CSSProperties, HTMLAttributes } from "react";

export type GridraSpinnerSize = "sm" | "md" | "lg" | number | string;
export type GridraSpinnerSpeed = "slow" | "normal" | "fast";
export type GridraSpinnerTone = "default" | "muted" | "accent";

export interface GridraSpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  label?: string;
  size?: GridraSpinnerSize;
  speed?: GridraSpinnerSpeed;
  tone?: GridraSpinnerTone;
}

export function GridraSpinner({
  className,
  label = "Loading",
  size = "md",
  speed = "normal",
  style,
  tone = "default",
  ...props
}: GridraSpinnerProps) {
  // preset名はmodifier class、それ以外のサイズはCSS変数で表現する。
  const spinnerClassName = [
    "gridra-spinner",
    typeof size === "string" && isPresetSize(size) ? `gridra-spinner--${size}` : null,
    `gridra-spinner--${tone}`,
    `gridra-spinner--${speed}`,
    className
  ]
    .filter(Boolean)
    .join(" ");
  const spinnerStyle = {
    ...style,
    ...getCustomSizeStyle(size)
  } as CSSProperties;

  return (
    <span aria-label={label} className={spinnerClassName} role="status" style={spinnerStyle} {...props}>
      <span className="gridra-spinner__track" aria-hidden="true" />
    </span>
  );
}

function isPresetSize(size: string): size is "sm" | "md" | "lg" {
  return size === "sm" || size === "md" || size === "lg";
}

function getCustomSizeStyle(size: GridraSpinnerSize): CSSProperties | undefined {
  // presetはCSS側に定義済みなので、inline styleを追加しない。
  if (typeof size === "string" && isPresetSize(size)) {
    return undefined;
  }

  // 数値はpxへ変換し、文字列なら任意のCSS長として扱う。
  const normalizedSize = typeof size === "number" ? `${size}px` : size;

  return {
    "--gridra-spinner-size": normalizedSize
  } as CSSProperties;
}
