import type { HTMLAttributes, ReactNode } from "react";

export interface GridraFieldProps extends HTMLAttributes<HTMLDivElement> {
  error?: ReactNode;
  hint?: ReactNode;
  htmlFor?: string;
  label: ReactNode;
}

export function GridraField({
  children,
  className,
  error,
  hint,
  htmlFor,
  label,
  ...props
}: GridraFieldProps) {
  const fieldClassName = [
    "gridra-field",
    error ? "gridra-field--invalid" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={fieldClassName} {...props}>
      <label className="gridra-field__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error ? <div className="gridra-field__hint">{hint}</div> : null}
      {error ? <div className="gridra-field__error">{error}</div> : null}
    </div>
  );
}
