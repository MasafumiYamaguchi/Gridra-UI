import type { HTMLAttributes } from "react";

export interface GridraSpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  label?: string;
}

export function GridraSpinner({
  className,
  label = "Loading",
  ...props
}: GridraSpinnerProps) {
  const spinnerClassName = ["gridra-spinner", className].filter(Boolean).join(" ");

  return (
    <span aria-label={label} className={spinnerClassName} role="status" {...props}>
      <span className="gridra-spinner__track" aria-hidden="true" />
    </span>
  );
}
