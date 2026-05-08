import type { InputHTMLAttributes } from "react";

export interface GridraInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function GridraInput({
  className,
  type = "text",
  ...props
}: GridraInputProps) {
  const inputClassName = ["gridra-input", className].filter(Boolean).join(" ");

  return <input className={inputClassName} type={type} {...props} />;
}
