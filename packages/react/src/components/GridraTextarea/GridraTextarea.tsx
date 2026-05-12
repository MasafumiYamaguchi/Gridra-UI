import type { TextareaHTMLAttributes } from "react";

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
  const textareaClassName = ["gridra-textarea", `gridra-textarea--${size}`, className]
    .filter(Boolean)
    .join(" ");
  const resolvedAriaInvalid = ariaInvalid ?? (invalid ? true : undefined);

  return <textarea aria-invalid={resolvedAriaInvalid} className={textareaClassName} {...props} />;
}
