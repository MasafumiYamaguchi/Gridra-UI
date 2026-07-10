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
  // checkedは外部が保持するcontrolled値で、コンポーネント内では反転後の値だけを通知する。
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
        // 利用側のonClickがpreventDefaultした場合は、状態変更通知を行わない。
        onClick?.(event);
        if (!event.defaultPrevented) {
          onCheckedChange?.(!checked);
        }
      }}
      role="switch"
      type={type}
      {...props}
    >
      {/* trackとthumbは装飾として隠し、状態はroleとaria-checkedで伝える。 */}
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
