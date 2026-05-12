import type { ButtonHTMLAttributes } from "react";
import { GridraSpinner } from "../GridraSpinner";

export type GridraButtonSize = "sm" | "md" | "lg";
export type GridraButtonVariant = "default" | "primary" | "ghost";

export interface GridraButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  loading?: boolean;
  pressed?: boolean;
  size?: GridraButtonSize;
  variant?: GridraButtonVariant;
}

export function GridraButton({
  children,
  className,
  disabled,
  fullWidth = false,
  loading = false,
  pressed,
  size = "md",
  type = "button",
  variant = "default",
  ...props
}: GridraButtonProps) {
  const buttonClassName = [
    "gridra-button",
    `gridra-button--${variant}`,
    `gridra-button--${size}`,
    pressed ? "gridra-button--pressed" : null,
    fullWidth ? "gridra-button--full-width" : null,
    loading ? "gridra-button--loading" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");
  const isDisabled = disabled || loading;

  return (
    <button
      aria-busy={loading || undefined}
      aria-pressed={pressed}
      className={buttonClassName}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {loading ? <GridraSpinner aria-hidden="true" label="Loading" size="sm" /> : null}
      {children}
    </button>
  );
}
