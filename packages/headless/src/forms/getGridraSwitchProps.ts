import type { ButtonHTMLAttributes } from "react";

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
    "aria-invalid": invalid || undefined,
    role: "switch",
    type,
    ...props,
    onClick: (event) => {
      onClick?.(event);
      // 利用側のonClickがpreventDefaultした場合は、状態変更通知を行わない。
      // disabledはネイティブbuttonではclickが発火しないが、通知を確実に止めるため明示的にも確認する。
      if (!event.defaultPrevented && !props.disabled) {
        onCheckedChange?.(!checked);
      }
    },
  };
}
