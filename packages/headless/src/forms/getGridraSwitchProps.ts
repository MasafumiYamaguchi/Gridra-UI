import type { ButtonHTMLAttributes } from "react";
import { resolveAriaInvalid } from "../internal/formControl";

export interface GridraSwitchBehaviorOptions extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "role"
> {
  checked?: boolean;
  invalid?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/** controlledなswitchの状態通知とネイティブ属性を解決する。 */
export function getGridraSwitchProps({
  checked = false,
  invalid = false,
  onCheckedChange,
  onClick,
  type = "button",
  ...props
}: GridraSwitchBehaviorOptions = {}): ButtonHTMLAttributes<HTMLButtonElement> {
  return {
    "aria-checked": checked,
    "aria-invalid": resolveAriaInvalid(undefined, invalid),
    role: "switch",
    type,
    ...props,
    onClick: (event) => {
      onClick?.(event);
      if (!event.defaultPrevented && !props.disabled)
        onCheckedChange?.(!checked);
    },
  };
}
