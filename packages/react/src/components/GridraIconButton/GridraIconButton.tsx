import type { ButtonHTMLAttributes, ReactNode } from "react";

export type GridraIconButtonVariant = "default" | "primary" | "ghost";

export interface GridraIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  pressed?: boolean;
  variant?: GridraIconButtonVariant;
}

export function GridraIconButton({
  children,
  className,
  label,
  pressed,
  title,
  type = "button",
  variant = "default",
  ...props
}: GridraIconButtonProps) {
  const iconButtonClassName = [
    "gridra-icon-button",
    `gridra-icon-button--${variant}`,
    pressed ? "gridra-icon-button--pressed" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");
  const icon: ReactNode = children ?? label.slice(0, 1);

  return (
    <button
      aria-label={label}
      aria-pressed={pressed}
      className={iconButtonClassName}
      title={title ?? label}
      type={type}
      {...props}
    >
      {icon}
    </button>
  );
}
