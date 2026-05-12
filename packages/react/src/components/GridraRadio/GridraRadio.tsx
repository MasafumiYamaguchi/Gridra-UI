import type { InputHTMLAttributes } from "react";

export interface GridraRadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export function GridraRadio({ className, label, ...props }: GridraRadioProps) {
  const radioClassName = ["gridra-radio", className].filter(Boolean).join(" ");

  return (
    <label className={radioClassName}>
      <input className="gridra-radio__input" type="radio" {...props} />
      <span className="gridra-radio__mark" aria-hidden="true" />
      {label ? <span className="gridra-radio__label">{label}</span> : null}
    </label>
  );
}
