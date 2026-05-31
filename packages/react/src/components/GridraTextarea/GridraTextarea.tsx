import type { TextareaHTMLAttributes } from "react";
import { cx } from "../../internal/classNames";
import { resolveAriaInvalid } from "../../internal/formControl";

export type GridraTextareaSize = "sm" | "md" | "lg";

export interface GridraTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  size?: GridraTextareaSize;
}

export function GridraTextarea({
  "aria-invalid": ariaInvalid,
  className,
  invalid = false,
  size = "md",
  ...props
}: GridraTextareaProps) {
  return (
    <textarea
      aria-invalid={resolveAriaInvalid(ariaInvalid, invalid)}
      className={cx("gridra-textarea", `gridra-textarea--${size}`, className)}
      {...props}
    />
  );
}
