import type { ButtonHTMLAttributes, ReactNode } from "react";
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
  const iconButtonClassName = [
    "gridra-icon-button",
    `gridra-icon-button--${variant}`,
    `gridra-icon-button--${size}`,
    pressed ? "gridra-icon-button--pressed" : null,
    loading ? "gridra-icon-button--loading" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");
  const icon: ReactNode = loading ? (
    <GridraSpinner aria-hidden="true" label="Loading" size="sm" />
  ) : (
    children ?? label.slice(0, 1)
  );
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
