import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";
import { GridraSpinner } from "../GridraSpinner";

export type GridraIconButtonSize = "sm" | "md" | "lg";
export type GridraIconButtonVariant = "default" | "primary" | "ghost";

export interface GridraIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  label: string;
  pressed?: boolean;
  size?: GridraIconButtonSize;
  variant?: GridraIconButtonVariant;
}

export function GridraIconButton({
  children,
  className,
  disabled,
  label,
  loading = false,
  pressed,
  size = "md",
  title,
  type = "button",
  variant = "default",
  ...props
}: GridraIconButtonProps) {
  const iconButtonClassName = cx(
    "gridra-icon-button",
    `gridra-icon-button--${variant}`,
    `gridra-icon-button--${size}`,
    pressed && "gridra-icon-button--pressed",
    loading && "gridra-icon-button--loading",
    className,
  );
  // loading中はchildrenを表示せず、labelの先頭文字を表示する
  // aria-hiddenをtrueにすることで、スクリーンリーダーがchildrenを読み上げないようにする
  const icon: ReactNode = loading ? (
    <GridraSpinner aria-hidden="true" label="Loading" size="sm" />
  ) : (
    children ?? label.slice(0, 1)
  );
  // loading中とdisabled中を同時に管理して、ボタンのdisabled属性を制御する
  const isDisabled = disabled || loading;

  return (
    <button
      aria-busy={loading || undefined}
      aria-label={label}
      aria-pressed={pressed}
      className={iconButtonClassName}
      disabled={isDisabled}
      title={title ?? label}
      type={type}
      {...props}
    >
      {icon}
    </button>
  );
}
