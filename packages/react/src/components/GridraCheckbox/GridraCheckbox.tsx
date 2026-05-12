import type { InputHTMLAttributes } from "react";

export interface GridraCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export function GridraCheckbox({
  className,
  label,
  ...props
}: GridraCheckboxProps) {
  const checkboxClassName = ["gridra-checkbox", className].filter(Boolean).join(" ");

  return (
    <label className={checkboxClassName}>
      <input className="gridra-checkbox__input" type="checkbox" {...props} />
      <span className="gridra-checkbox__mark" aria-hidden="true" />
      {label ? <span className="gridra-checkbox__label">{label}</span> : null}
    </label>
  );
}
