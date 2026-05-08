import type { SelectHTMLAttributes } from "react";

export interface GridraSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export function GridraSelect({ className, ...props }: GridraSelectProps) {
  const selectClassName = ["gridra-select", className].filter(Boolean).join(" ");

  return <select className={selectClassName} {...props} />;
}
