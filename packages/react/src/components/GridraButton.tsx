import type { ButtonHTMLAttributes } from "react";

export type GridraButtonVariant = "default" | "primary" | "ghost";

export interface GridraButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  variant?: GridraButtonVariant;
}

export function GridraButton({
  className,
  pressed,
  type = "button",
  variant = "default",
  ...props
}: GridraButtonProps) {
  const buttonClassName = [
    "gridra-button",
    `gridra-button--${variant}`,
    pressed ? "gridra-button--pressed" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      aria-pressed={pressed}
      className={buttonClassName}
      type={type}
      {...props}
    />
  );
}
