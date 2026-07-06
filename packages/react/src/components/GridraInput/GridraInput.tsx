import type { InputHTMLAttributes } from "react";
import { cx } from "../../internal/classNames";
import { resolveAriaInvalid } from "../../internal/formControl";

export type GridraInputSize = "sm" | "md" | "lg";

// HTML属性とぶつかるため、InputHTMLAttributesからsizeを除外して独自定義する
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
  return (
    <input
      aria-invalid={resolveAriaInvalid(ariaInvalid, invalid)}
      className={cx("gridra-input", `gridra-input--${size}`, className)}
      type={type}
      {...props}
    />
  );
}
