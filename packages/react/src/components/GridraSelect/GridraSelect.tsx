import type { SelectHTMLAttributes } from "react";
import { cx } from "../../internal/classNames";
import { resolveAriaInvalid } from "../../internal/formControl";

export type GridraSelectSize = "sm" | "md" | "lg";

export interface GridraSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  invalid?: boolean;
  size?: GridraSelectSize;
}

export function GridraSelect({
  "aria-invalid": ariaInvalid,
  className,
  invalid = false,
  size = "md",
  ...props
}: GridraSelectProps) {
  return (
    <select
      aria-invalid={resolveAriaInvalid(ariaInvalid, invalid)}
      className={cx("gridra-select", `gridra-select--${size}`, className)}
      {...props}
    />
  );
}
