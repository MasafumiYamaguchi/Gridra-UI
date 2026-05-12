import type { ButtonHTMLAttributes } from "react";

export interface GridraSwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "role"> {
  checked?: boolean;
  label?: string;
}

export function GridraSwitch({
  checked = false,
  className,
  label,
  type = "button",
  ...props
}: GridraSwitchProps) {
  const switchClassName = [
    "gridra-switch",
    checked ? "gridra-switch--checked" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      aria-checked={checked}
      className={switchClassName}
      role="switch"
      type={type}
      {...props}
    >
      <span className="gridra-switch__track" aria-hidden="true">
        <span className="gridra-switch__thumb" />
      </span>
      {label ? <span className="gridra-switch__label">{label}</span> : null}
    </button>
  );
}
