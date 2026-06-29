import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";

export interface GridraFieldProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  error?: ReactNode;
  errorId?: string;
  hint?: ReactNode;
  hintId?: string;
  htmlFor?: string;
  label: ReactNode;
  orientation?: "vertical" | "horizontal";
  required?: boolean;
}

export function GridraField({
  children,
  className,
  disabled = false,
  error,
  errorId,
  hint,
  hintId,
  htmlFor,
  label,
  orientation = "vertical",
  required = false,
  ...props
}: GridraFieldProps) {
  // Fieldはlabel/hint/errorの配置と状態classだけを持ち、control本体の属性接続は子コンポーネントへ委ねる。
  const fieldClassName = cx(
    "gridra-field",
    `gridra-field--${orientation}`,
    error ? "gridra-field--invalid" : null,
    disabled ? "gridra-field--disabled" : null,
    required ? "gridra-field--required" : null,
    className,
  );

  return (
    <div className={fieldClassName} {...props}>
      <label className="gridra-field__label" htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="gridra-field__required" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <div className="gridra-field__hint" id={hintId}>
          {hint}
        </div>
      ) : null}
      {error ? (
        <div className="gridra-field__error" id={errorId}>
          {error}
        </div>
      ) : null}
    </div>
  );
}
