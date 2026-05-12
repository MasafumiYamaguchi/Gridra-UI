import type { LabelHTMLAttributes } from "react";

export interface GridraLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export function GridraLabel({ className, ...props }: GridraLabelProps) {
  const labelClassName = ["gridra-label", className].filter(Boolean).join(" ");

  return <label className={labelClassName} {...props} />;
}
