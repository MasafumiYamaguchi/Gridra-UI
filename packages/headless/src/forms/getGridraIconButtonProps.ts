import type { ButtonHTMLAttributes } from "react";
import {
  getGridraButtonProps,
  type GridraButtonBehaviorOptions,
} from "./getGridraButtonProps";

export interface GridraIconButtonBehaviorOptions extends GridraButtonBehaviorOptions {
  label: string;
}

/**
 * アイコンボタンの名前と操作ロックを解決する。
 *
 * loading中とdisabled中は`getGridraButtonProps`で同時に管理し、disabled属性を制御する。
 * `title`未指定時はlabelを使い、ホバー時のツールチップでもアイコンの意味を伝える。
 */
export function getGridraIconButtonProps({
  label,
  title,
  ...props
}: GridraIconButtonBehaviorOptions): ButtonHTMLAttributes<HTMLButtonElement> {
  return getGridraButtonProps({
    "aria-label": label,
    title: title ?? label,
    ...props,
  });
}
