import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";
import { resolveAriaInvalid } from "../../internal/formControl";

export type GridraSwitchSize = "sm" | "md" | "lg";

export interface GridraSwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "role"> {
  checked?: boolean;
  description?: ReactNode;
  invalid?: boolean;
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
  size?: GridraSwitchSize;
}

export function GridraSwitch({
  checked = false,
  className,
  description,
  invalid = false,
  label,
  onCheckedChange,
  onClick,
  size = "md",
  type = "button",
  ...props
}: GridraSwitchProps) {
  const switchClassName = cx(
    "gridra-switch",
    `gridra-switch--${size}`,
    checked && "gridra-switch--checked",
    invalid && "gridra-switch--invalid",
    className,
  );

  return (
    <button
      aria-checked={checked}
      aria-invalid={resolveAriaInvalid(undefined, invalid)}
      className={switchClassName}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          onCheckedChange?.(!checked);
        }
      }}
      role="switch"
      type={type}
      {...props}
    >
      <span className="gridra-switch__track" aria-hidden="true">
        <span className="gridra-switch__thumb" />
      </span>
      {label || description ? (
        <span className="gridra-switch__content">
          {label ? <span className="gridra-switch__label">{label}</span> : null}
          {description ? <span className="gridra-switch__description">{description}</span> : null}
        </span>
      ) : null}
    </button>
  );
}
