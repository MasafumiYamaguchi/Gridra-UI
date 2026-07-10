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
  // size・tone・alignを独立したmodifierにし、表示内容と見た目の指定を分離する。
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
      {/* labelとdescriptionは任意だが、中心となるvalueは常に描画する。 */}
      {label ? <div className="gridra-stat__label">{label}</div> : null}
      <div className="gridra-stat__value">{value}</div>
      {description ? (
        <div className="gridra-stat__description">{description}</div>
      ) : null}
    </div>
  );
}
