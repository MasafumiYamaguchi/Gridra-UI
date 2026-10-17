import {getGridraButtonProps} from "@gridra-ui/headless";
import type { ButtonHTMLAttributes } from "react";
import { cx } from "../../internal/classNames";
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
  const buttonClassName = cx(
    "gridra-button",
    `gridra-button--${variant}`,
    `gridra-button--${size}`,
    pressed && "gridra-button--pressed",
    fullWidth && "gridra-button--full-width",
    loading && "gridra-button--loading",
    className,
  );
  // loading中は二重送信を避けるため、disabledと同じ操作ロックとして扱う。


  return (
    <button
      {...getGridraButtonProps({loading,pressed,disabled,type,...props})}
      className={buttonClassName}
    >
      {loading ? <GridraSpinner aria-hidden="true" label="Loading" size="sm" /> : null}
      {children}
    </button>
  );
}
