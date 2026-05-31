import type { LabelHTMLAttributes } from "react";
import { cx } from "../../internal/classNames";

export interface GridraLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export function GridraLabel({ className, ...props }: GridraLabelProps) {
  return <label className={cx("gridra-label", className)} {...props} />;
}
