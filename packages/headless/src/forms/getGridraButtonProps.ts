import type { ButtonHTMLAttributes } from "react";

export interface GridraButtonBehaviorOptions extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  pressed?: boolean;
}

/**
 * loading中の操作ロックと押下状態をネイティブbuttonへ渡す。
 *
 * loading中は二重送信を避けるため、disabledと同じ操作ロックとして扱う。
 * `disabled`は`loading`が優先されるため、loading中に`disabled={false}`を渡しても
 * ロックは解除できない。一方でそれ以外の属性（`aria-busy`など）は`...props`で上書きできる。
 */
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
