import type { TextareaHTMLAttributes } from "react";

export interface GridraTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function GridraTextarea({ className, ...props }: GridraTextareaProps) {
  const textareaClassName = ["gridra-textarea", className].filter(Boolean).join(" ");

  return <textarea className={textareaClassName} {...props} />;
}
