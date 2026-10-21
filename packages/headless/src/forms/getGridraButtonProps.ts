import type { ButtonHTMLAttributes } from "react";

export interface GridraButtonBehaviorOptions extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  pressed?: boolean;
}

/** loading中の操作ロックと押下状態をネイティブbuttonへ渡す。 */
export function getGridraButtonProps({
  loading = false,
  pressed,
  disabled,
  type = "button",
  ...props
}: GridraButtonBehaviorOptions = {}): ButtonHTMLAttributes<HTMLButtonElement> {
  return {
    "aria-busy": loading || undefined,
    "aria-pressed": pressed,
    disabled: disabled || loading,
    type,
    ...props,
  };
}
