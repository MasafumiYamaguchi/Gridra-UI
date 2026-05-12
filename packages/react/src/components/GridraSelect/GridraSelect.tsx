import type { SelectHTMLAttributes } from "react";

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
  const selectClassName = ["gridra-select", `gridra-select--${size}`, className]
    .filter(Boolean)
    .join(" ");
  const resolvedAriaInvalid = ariaInvalid ?? (invalid ? true : undefined);

  return <select aria-invalid={resolvedAriaInvalid} className={selectClassName} {...props} />;
}
