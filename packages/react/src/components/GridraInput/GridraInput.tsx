import type { InputHTMLAttributes } from "react";

export type GridraInputSize = "sm" | "md" | "lg";

export interface GridraInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  invalid?: boolean;
  size?: GridraInputSize;
}

export function GridraInput({
  "aria-invalid": ariaInvalid,
  className,
  invalid = false,
  size = "md",
  type = "text",
  ...props
}: GridraInputProps) {
  const inputClassName = ["gridra-input", `gridra-input--${size}`, className]
    .filter(Boolean)
    .join(" ");
  const resolvedAriaInvalid = ariaInvalid ?? (invalid ? true : undefined);

  return (
    <input
      aria-invalid={resolvedAriaInvalid}
      className={inputClassName}
      type={type}
      {...props}
    />
  );
}
