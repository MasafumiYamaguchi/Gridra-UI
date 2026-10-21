import {
  getGridraButtonProps,
  type GridraButtonBehaviorOptions,
} from "./getGridraButtonProps";

export interface GridraIconButtonBehaviorOptions extends GridraButtonBehaviorOptions {
  label: string;
}

/** アイコンボタンの名前と操作ロックを解決する。 */
export function getGridraIconButtonProps({
  label,
  title,
  ...props
}: GridraIconButtonBehaviorOptions) {
  return getGridraButtonProps({
    "aria-label": label,
    title: title ?? label,
    ...props,
  });
}
