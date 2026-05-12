import type { InputHTMLAttributes, ReactNode } from "react";

export type GridraCheckboxSize = "sm" | "md" | "lg";

export interface GridraCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  description?: ReactNode;
  invalid?: boolean;
  label?: string;
  size?: GridraCheckboxSize;
}

export function GridraCheckbox({
  "aria-invalid": ariaInvalid,
  className,
  description,
  invalid = false,
  label,
  size = "md",
  ...props
}: GridraCheckboxProps) {
  const checkboxClassName = [
    "gridra-checkbox",
    `gridra-checkbox--${size}`,
    invalid ? "gridra-checkbox--invalid" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");
  const resolvedAriaInvalid = ariaInvalid ?? (invalid ? true : undefined);

  return (
    <label className={checkboxClassName}>
      <input
        aria-invalid={resolvedAriaInvalid}
        className="gridra-checkbox__input"
        type="checkbox"
        {...props}
      />
      <span className="gridra-checkbox__mark" aria-hidden="true" />
      {label || description ? (
        <span className="gridra-checkbox__content">
          {label ? <span className="gridra-checkbox__label">{label}</span> : null}
          {description ? <span className="gridra-checkbox__description">{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}
